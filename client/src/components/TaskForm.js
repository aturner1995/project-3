import React, { useState, useEffect, useRef } from "react";
import { Form, Spinner } from "react-bootstrap";
import { CREATE_SERVICE } from "../utils/mutations";
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_REVERSE_GEOCODE, QUERY_CATEGORY } from '../utils/queries';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";

const TaskForm = () => {
    // Define state variables
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState([
        { title: "", description: "", price: "" } // Initial option
    ]);
    const [images, setImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const toast = useRef(null);
    const [userAddress, setUserAddress] = useState('');
    const [createService] = useMutation(CREATE_SERVICE);
    const [loading, setLoading] = useState(false);

    // Get user's geolocation on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);

                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    // Query reverse geocode based on latitude and longitude
    const { data } = useQuery(QUERY_REVERSE_GEOCODE, {
        skip: !latitude || !longitude,
        variables: { latitude, longitude },
    });

    // Query category data
    const { data: catData } = useQuery(QUERY_CATEGORY)

    // Extract categories from the query result, or assign an empty array if no data
    const categories = catData?.categories || [];

    // Update userAddress when reverse geocode data changes
    useEffect(() => {
        if (data) {
            if (data.reverseGeocode) {
                setUserAddress(
                    `${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`
                );
            }
        }
    }, [data]);

    // Handle change of option field value
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    // Add a new empty option
    const handleAddOption = () => {
        setOptions([...options, { title: "", description: "", price: "" }]);
    };

    // Remove an option by index
    const handleRemoveOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const selectedImages = [];

        // Check file size for each selected image
        const maxSize = 1 * 1024 * 1024; // 1MB
        const oversizedFiles = files.filter((file) => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Some files exceed the maximum file size (1MB). Please choose smaller files.",
                life: 5000,
            });
            return;
        }

        files.slice(0, 5).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                selectedImages.push(reader.result);
                if (selectedImages.length === files.length) {
                    setImages([...images, ...selectedImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedCategory) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a category",
                life: 3000,
            });
            return;
        }

        // Check if already loading
        if (loading) {
            return;
        }

        // Set loading state to true
        setLoading(true);

        try {
            const input = {
                name: title,
                description,
                options,
                images: images.map((url) => ({ url })),
                location: {
                    address: userAddress
                },
                categoryId: (categories.filter((cat) => cat.name === selectedCategory))[0]._id,
            };

            // Call the createService mutation
            const { data } = await createService({ variables: { input } });

            // Handle success
            console.log("Created service:", data.createService);

            toast.current.show({
                severity: "success",
                summary: "Task Created!",
                life: 3000,
            });

            // Reset form fields
            setTitle("");
            setDescription("");
            setOptions([{ title: "", description: "", price: "" }]);
            setImages([]);
        } catch (error) {
            // Handle error
            console.error("Failed to create service:", error);
        } finally {
            // Set loading state back to false
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="m-5">
            <div className="text-center">
                <h2>Create Task</h2>
            </div>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="address">
                <Form.Label>Location</Form.Label>
                <Form.Control
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
                <Form.Select aria-label="Default select example" onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option>Select a Category</option>
                    {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="images">
                <Form.Label>Images</Form.Label>
                <Form.Control type="file" multiple onChange={handleImageUpload} />
            </Form.Group>

            {images.length > 0 && (
                <div>
                    <Form.Label>Preview</Form.Label>
                    <div>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "100px", marginRight: "10px" }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Form.Group>
                <div className="text-center mt-2">
                    <h5>Options</h5>
                </div>
                {options.map((option, index) => (
                    <div key={index}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={option.title}
                                onChange={(e) =>
                                    handleOptionChange(index, "title", e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={option.description}
                                onChange={(e) =>
                                    handleOptionChange(index, "description", e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={option.price}
                                onChange={(e) =>
                                    handleOptionChange(index, "price", parseFloat(e.target.value))
                                }
                                required
                            />
                        </Form.Group>
                        <Button
                            severity="danger"
                            size="small"
                            className="mt-2"
                            onClick={() => handleRemoveOption(index)}
                            outlined
                        >
                            Remove Option
                        </Button>
                    </div>
                ))}
                <Button severity="success" onClick={handleAddOption} size="small" className="my-2" outlined>
                    Add Option
                </Button>
            </Form.Group>
            <div className="text-center">
                <Button severity='success' type="submit" disabled={loading}>
                    {loading ? <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Task...
                    </> : "Submit"}
                </Button>
            </div>
            <Toast ref={toast}></Toast>
        </Form>
    );
};

export default TaskForm;
