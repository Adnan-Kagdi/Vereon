import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogsProvider, useDialogs } from '@toolpad/core/useDialogs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyCustomDialog({ open, onClose }) {
    const [issueTitle, setIssueTitle] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const navigate = useNavigate();

    const handleIssueCreation = async () => {
        const issue = await axios.post("https://vereon.onrender.com/issue/create",
            {
                title: issueTitle,
                description: issueDescription
            }
        );

        navigate("/");
    }

    return (
        <Dialog fullWidth open={open} onClose={() => onClose(null)}>
            <DialogTitle>Dialog with payload</DialogTitle>
            <DialogContent>
                <TextField
                    label="Your issue title"
                    fullWidth
                    className="mt-3"
                    required
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                />
                <TextField
                    id="filled-multiline-flexible"
                    fullWidth
                    label="Describe the Issue"
                    multiline
                    maxRows={7}
                    className="mt-3"
                    required
                    variant="filled"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleIssueCreation}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}



function DemoContent() {
    const dialogs = useDialogs();
    return (
        <Stack spacing={2}>
            <Button
                onClick={async () => {
                    // preview-start
                    const result = await dialogs.open(MyCustomDialog);
                    // preview-end
                }}
            >
                Open
            </Button>
        </Stack>
    );
}

export default function CustomDialogWithResult() {
    return (
        <DialogsProvider>
            <DemoContent />
        </DialogsProvider>
    );
}
