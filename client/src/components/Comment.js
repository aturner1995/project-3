import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_COMMENT, REMOVE_COMMENT } from "../utils/mutations";
import { QUERY_SERVICE, QUERY_USER } from "../utils/queries";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import Auth from "../utils/auth";
import { Dropdown } from 'primereact/dropdown';

const Comment = ({ serviceId }) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [addComment] = useMutation(ADD_COMMENT);
  const [removeComment] = useMutation(REMOVE_COMMENT);
  const { data: userData } = useQuery(QUERY_USER);
  const [sortOrder, setSortOrder] = useState('latest'); 
  const { loading, error, data } = useQuery(QUERY_SERVICE, {
    variables: { id: serviceId },
  });
  const toast = useRef(null);

  console.log(rating)

  useEffect(() => {
    if (data) {
      const { service } = data;
      let sortedComments = service.comments.slice(); 

      if (sortOrder === 'latest') {
        sortedComments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      } else if (sortOrder === 'oldest') {
        sortedComments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      }

      setComments(sortedComments);
    }
  }, [data, sortOrder]);

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!Auth.loggedIn()) {
      return;
    }

    try {
      await addComment({
        variables: { serviceId, commentText, rating, userId: userData?.user?._id },
        refetchQueries: [{ query: QUERY_SERVICE, variables: { id: serviceId } }],
      });

      const newComment = {
        _id: Date.now(),
        commentText,
        rating,
        createdAt: new Date().toLocaleString(),
        user: {
          _id: userData?.user?._id,
          username: userData?.user?.username,
        },
      };

      setComments([...comments, newComment]);
      setCommentText('');
      setRating(0);

      toast.current.show({
        severity: 'success',
        summary: 'Review Added',
        detail: 'Your review has been added successfully.',
        life: 3000,
      });
    } catch (error) {
      console.error(error);

      toast.current.show({
        severity: 'error',
        summary: 'Review Error',
        detail: 'Failed to add comment. Please try again.',
        life: 3000,
      });
    }
  };

  const handleRemoveComment = async (commentId) => {
    if (!Auth.loggedIn()) {
      return;
    }

    try {
      await removeComment({
        variables: { serviceId, commentId },
        refetchQueries: [{ query: QUERY_SERVICE, variables: { id: serviceId } }],
      });
      setComments(comments.filter((comment) => comment._id !== commentId));

      toast.current.show({
        severity: 'success',
        summary: 'Review Removed',
        detail: 'Your review has been removed successfully.',
        life: 3000,
      });
    } catch (error) {
      console.error(error);

      toast.current.show({
        severity: 'error',
        summary: 'Review Error',
        detail: 'Failed to remove comment. Please try again.',
        life: 3000,
      });
    }
  };

  const handleAddReviewClick = () => {
    if (!Auth.loggedIn()) {
      return;
    }

    setShowAddReview(true);
  };

  const handleViewMoreReviewsClick = () => {
    setShowAllReviews(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const displayedComments = showAllReviews ? comments : comments.slice(0, 3);

  return (
    <div className="comment-container container mt-5">
      <Toast ref={toast} />

      <h4 className="comment-heading">Reviews</h4>
      <div className="mb-3">
        <label htmlFor="sortOrder">Sort Order:</label>
        <Dropdown
          id="sortOrder"
          options={[
            { label: 'Latest to Oldest', value: 'latest' },
            { label: 'Oldest to Latest', value: 'oldest' }
          ]}
          value={sortOrder}
          onChange={handleSortOrderChange}
        />
      </div>


      {!showAddReview && Auth.loggedIn() && (
        <Button
          className="btn btn-primary mb-3"
          label="Add Review"
          severity="success" 
          onClick={handleAddReviewClick}
        />
      )}

      {showAddReview && Auth.loggedIn() && (
        <form onSubmit={handleCommentSubmit} className="mb-3">
                    <div className="form-group mb-2">
            <Rating
              value={rating}
              cancel={false}
              onChange={(e) => setRating(e.value)}
              stars={5}
              className="mb-2"
              onIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon-active.png" alt="custom-image-active" width="25px" height="25px" />}
                offIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon.png" alt="custom-image" width="25px" height="25px" />}
            />
          </div>
          <div className="form-group">
            <InputTextarea
              className="form-control"
              rows={4}
              placeholder="Enter your review"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>

          <Button type="submit" label="Submit" className="btn btn-primary mr-2 me-2 mt-2" severity="success" />
          <Button
            className="btn btn-light"
            label="Cancel"
            severity="success" 
            onClick={() => setShowAddReview(false)}
          />
        </form>
      )}

      <Divider />

      {displayedComments.length === 0 ? (
        <p className="comment-no-comments">No reviews yet. Be the first one to review!</p>
      ) : (
        displayedComments.map((comment) => (
          <Card key={comment._id} className="comment-card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <FontAwesomeIcon icon={faClock} className="mr-1 me-2" />
                  {comment.createdAt} by {comment.user.username}
                </span>
                {Auth.loggedIn() && comment.user._id === userData?.user?._id && (
                  <Button
                    className="p-button-rounded p-button-danger p-button-sm"
                    icon={<FontAwesomeIcon icon={faTrashAlt} />}
                    onClick={() => handleRemoveComment(comment._id)}
                    tooltip="Remove Review"
                    tooltipOptions={{ position: 'top' }}
                  />
                )}
              </div>
              <p className="card-text">{comment.commentText}</p>
              <div>
                <Rating value={comment.rating} readOnly cancel={false} stars={5}   style={{ color: 'gold' }} onIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon-active.png" alt="custom-image-active" width="25px" height="25px" />}
                offIcon={<img src="https://primefaces.org/cdn/primereact/images/rating/custom-icon.png" alt="custom-image" width="25px" height="25px" />} />
              </div>
            </div>
          </Card>
        ))
      )}

      {!showAllReviews && comments.length > 3 && (
        <Button
          className="btn btn-link mb-3"
          label="View More"
          severity="success" 
          onClick={handleViewMoreReviewsClick}
        />
      )}
    </div>
  );
};

export default Comment;
