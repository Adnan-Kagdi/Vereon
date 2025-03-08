import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';

function InstDetails() {
    return (
        <div className="p-2 detail-div" style={{marginTop: "4rem"}}>
            <Navbar />
            <h3 style={{ color: "grey" }} className="ms-4">Repository Command Instructions</h3>

            <ul style={{ color: "rgb(128, 128, 128, 0.6)" }} className="mt-3">
                <li>To initialize new repository</li>
                <pre className="inst-pre">
                    node app.js init
                </pre>

                <li>Add a file to the staging area</li>
                <pre className="inst-pre">
                    node app.js add -your file name-
                </pre>

                <li>Commit changes with a message</li>
                <pre className="inst-pre">
                    node app.js commit -your message-
                </pre>

                <li>Push changes to a repository</li>
                <pre className="inst-pre">
                    node app.js push -your repoId-
                </pre>

                <li>Pull the latest changes</li>
                <pre className="inst-pre">
                    node app.js pull
                </pre>

                <li>Revert changes for a specific file</li>
                <pre className="inst-pre">
                    node app.js revert -your file-
                </pre>
            </ul>

            <h4 className='detail-home ms-3' style={{ marginTop: "2.5rem" }}>
                <KeyboardDoubleArrowLeftIcon style={{ fontSize: "1.8rem", marginBottom: "4px" }} />
                <Link to="/" className='detail-home'>dashboard</Link>
            </h4>
        </div>
    );
}

export default InstDetails;