import React from 'react';
import './App.css';

function App() {
    return (
        <React.Fragment>
            <header>
                <span>Photos</span>
                <div>
                    <button>&#12296;</button>
                    Page <input type="number" /> of 100
                    <button>&#12297;</button>
                </div>
                <div>
                    <div>Upload</div>|<div>Delete</div>
                </div>
            </header>
            <main>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </main>
            <footer>
                <div></div>
            </footer>
        </React.Fragment>
    );
}

export default App;
