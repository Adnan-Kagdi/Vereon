import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import CreateRepoForm from "../components/repo/CreateRepo"
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./navbar.css"


export default function CreateRepoNav() {
    const [open, setOpen] = React.useState(false);
    const [age, setAge] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setAge(Number(event.target.value) || '');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const handleToOpenRepo = () => {
        navigate("/createRepo");
    }

    const handleToOpenDetail = () => {
        navigate("/details");
    }

    return (
        <div style={{ marginRight: "1rem" }}>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab size="small" color="primary" aria-label="add" className="add-repo">
                    <AddIcon onClick={handleClickOpen} className='add-repo-btn' />
                </Fab>
            </Box>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose} className='repo-dialog'>
                <DialogTitle className='repo-dialogCont' style={{ color: "white" }}>Choose you want</DialogTitle>
                <DialogContent className='repo-dialogCont'>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} >
                            <Button onClick={handleToOpenRepo} className='create-repo-btn'>
                            <i class="fa-solid fa-file fs-6" style={{ color: "white", marginBottom: "2px" }}></i>
                            &nbsp; New Repository  
                            </Button>
                        </FormControl>
                        <span style={{ backgroundColor: "yellow", color: "green" }}></span>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Button onClick={handleToOpenDetail} className='create-repo-btn'>
                                Import Repository &nbsp;
                                <LabelImportantIcon className='fs-5' style={{ color: "white", marginBottom: "2px" }} />
                            </Button>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions className='repo-dialogCont'>
                    <Button onClick={handleClose} className='repo-cnBtn'>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
