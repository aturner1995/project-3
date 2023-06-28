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
import { Toast } from 'primereact/toast';
import Auth from "../utils/auth";

const Comment = ({ serviceId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [addComment] = useMutation(ADD_COMMENT);
  const [removeComment] = useMutation(REMOVE_COMMENT);
  const { data: userData } = useQuery(QUERY_USER);
  const { loading, error, data } = useQuery(QUERY_SERVICE, {
    variables: { id: serviceId },
  });
  const toast = useRef(null);

  useEffect(() => {
    if (data) {
      const { service } = data;
      setComments(service.comments);
    }
  }, [data]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!Auth.loggedIn()) {
      // Redirect to login page or show a message to log in
      return;
    }

    try {
      await addComment({
        variables: { serviceId, commentText, userId: userData?.user?._id },
        refetchQueries: [{ query: QUERY_SERVICE, variables: { id: serviceId } }],
      });

      const newComment = {
        _id: Date.now(),
        commentText,
        createdAt: new Date().toLocaleString(),
        user: {
          _id: userData?.user?._id,
          username: userData?.user?.username,
        },
      };

      setComments([...comments, newComment]);
      setCommentText('');

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
    // Check if user is logged in
    if (!Auth.loggedIn()) {
      // Redirect to login page or show a message to log in
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
    // Check if user is logged in
    if (!Auth.loggedIn()) {
      // Redirect to login page or show a message to log in
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

      {!showAddReview && Auth.loggedIn() && (
        <Button
          className="btn btn-primary mb-3"
          label="Add Review"
          onClick={handleAddReviewClick}
        />
      )}

      {showAddReview && Auth.loggedIn() && (
        <form onSubmit={handleCommentSubmit} className="mb-3">
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
          <Button type="submit" label="Submit" className="btn btn-primary mr-2 me-2 mt-2" />
          <Button
            className="btn btn-light"
            label="Cancel"
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
            </div>
          </Card>
        ))
      )}

      {!showAllReviews && comments.length > 3 && (
        <Button
          className="btn btn-link"
          label="View More"
          onClick={handleViewMoreReviewsClick}
        />
      )}
    </div>
  );
};

export default Comment;
