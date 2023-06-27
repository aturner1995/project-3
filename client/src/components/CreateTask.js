import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import TaskForm from "./TaskForm";

const CreateTask = () => {
    const [showTaskForm, setShowTaskForm] = useState(false);

    return (
        <>
            <Button label="Create Task" severity="success" onClick={() => setShowTaskForm(true)} />
            <Modal
                as={motion.div}
                size="lg"
                fullscreen="true"
                show={showTaskForm}
                onHide={() => setShowTaskForm(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                dialogClassName="custom-modal"
                className="p-5"
            >
                <TaskForm /> 
            </Modal>
        </>
    )
}

export default CreateTask