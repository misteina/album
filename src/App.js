import React from 'react';
import './App.css';

function App() {
    return (
        <React.Fragment>
            <header>
                <span>Photos</span>
                <div>
                    <button>&#12296;</button>Page 1<button>&#12297;</button>
                </div>
                <div>
                    <div>Upload</div>|<div>Delete</div>
                </div>
            </header>
            <main>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Albumm
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <b>Name</b><br />Album
                    </div>
                </div>
            </main>
            <div id="upload">
                <div>
                    <div>Upload photos</div>
                    <div>Drag and drop files here or click to select files.</div>
                    <div>No files selected</div>
                    <div>
                        <select>
                            <option>Travel</option>
                            <option>Personal</option>
                            <option>Food</option>
                            <option>Nature</option>
                            <option>Other</option>
                        </select>
                        <button>Upload</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default App;
