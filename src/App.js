import React from 'react';
import './App.css';

function App() {

    const [state, setState] = React.useState({
        uploadDialog: false,
        uploadStatus: 'No file(s) selected',
        files: [],
        album: 'select',
        formData: null,
        photos: [],
        skip: 0
    });

    React.useEffect(() => {
        fetch('http://localhost:8888/photos/list', {
            method: 'POST',
            body: JSON.stringify({ skip: state.skip, limit: 10 }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
            res => res.json()
        ).then(
            (data) => {
                setState(state => ({ ...state, photos: data.documents }));
            },
            (error) => {
                console.error(error)
            }
        )
    }, [state.skip]);

    const selectAlbum = (e) => {
        setState(state => ({ ...state, album: e.target.value}));
    }

    const selectFiles = (e) => {
        const files = e.target.files;
        let counter = 0;
        for (let file of files) {
            let type = file.type;
            if (type === 'image/jpeg' || type === 'image/png') {
                counter++;
            }
        }
        let status = (counter === 0) ? 'No' : counter;
        setState(state => ({
            ...state,
            files: files,
            uploadStatus: `${status} file(s) selected`
        }));
    }

    const onDrop = (e) => {
        e.preventDefault();
        const files = [];
        const types = ['image/jpeg', 'image/png'];
        if (e.dataTransfer.items) {
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                let file = e.dataTransfer.items[i].getAsFile();
                if (types.includes(file.type)) {
                    files.push(file);
                    state.formData.append("documents", file, file.name);
                }
            }
        } else {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                if (types.includes(e.dataTransfer.files[i].type)){
                    files.push(e.dataTransfer.files[i]);
                    state.formData.append(
                        "documents", 
                        e.dataTransfer.files[i], 
                        e.dataTransfer.files[i].name
                    );
                }
            }
        }
        setState(state => ({
            ...state,
            files: files,
            uploadStatus: `${files.length} file(s) selected`
        }));
    }

    const onDragOver = (e) => {
        e.preventDefault();
    }

    const upload = (e) => {
        if (state.files.length > 0){
            if (state.album !== 'select'){
                setState(state => ({ ...state, uploadStatus: 'Uploading...' }));
                state.formData.append('album', state.album);
                for (let file of state.files) {
                    let type = file.type;
                    if (type === 'image/jpeg' || type === 'image/png') {
                        state.formData.append("documents", file, file.name);
                    }
                }
                fetch('http://localhost:8888/photos', {
                    method: 'PUT',
                    body: state.formData
                }).then(function (res) {
                    return res.json();
                }).then(function (data) {
                    const status = data.message === 'OK' ? 'File(s) uploaded' : 
                        'File(s) uploading failed';
                    setState(state => ({
                        ...state,
                        uploadStatus: status,
                        files: [],
                        album: 'select',
                        formData: new FormData()
                    }));
                }).catch(function (e) {
                    console.log('Error', e);
                });
            } else {
                alert('Please choose an album');
            }
        } else {
            alert('No photo(s) selected for upload');
        }
    }

    const openUploadDialog = () => {
        document.getElementById('root').classList.add('noscroll');
        setState(state => ({
            ...state,
            uploadDialog: true,
            formData: new FormData()
        }));
    }

    const dismiss = (e) => {
        if (e.target.id === 'upload'){
            document.getElementById('root').classList.remove('noscroll');
            setState(state => ({
                ...state,
                uploadStatus: 'No file(s) selected',
                uploadDialog: false,
                formData: null
            }));
        }
    }

    return (
        <React.Fragment>
            <header>
                <span>Photos</span>
                <div>
                    <button>&#12296;</button>Page 1<button>&#12297;</button>
                </div>
                <div>
                    <div onClick={openUploadDialog}>Upload</div>|<div>Delete</div>
                </div>
            </header>
            <main>
                {
                    state.photos.map((photo) => 
                        <div key={photo.id}>
                            <div><img src={photo.raw} alt={photo.name} /></div>
                            <div>
                                <b>{photo.name.split('/').pop()}</b><br />{photo.album}
                            </div>
                        </div>
                    )
                } 
            </main>
            <UploadDialog 
                display={state.uploadDialog}
                dialogClick={dismiss}
                onDrop={onDrop}
                onDragOver={onDragOver}
                selectFiles={selectFiles}
                uploadStatus={state.uploadStatus}
                album={state.album}
                onChange={selectAlbum}
                upload={upload}
            />
        </React.Fragment>
    );
}

function UploadDialog(props){
    if (props.display){
        return (
            <div id="upload" onClick={props.dialogClick}>
                <div>
                    <div>Upload photos</div>
                    <div onDrop={props.onDrop} onDragOver={props.onDragOver}>
                        Drag and drop files here or click to select files.
                        <input
                            onChange={props.selectFiles}
                            type="file"
                            accept="image/png, image/jpeg"
                            multiple
                        />
                    </div>
                    <div>{props.uploadStatus}</div>
                    <div>
                        <select value={props.album} onChange={props.onChange}>
                            <option value="select">Choose album</option>
                            <option value="travel">Travel</option>
                            <option value="personal">Personal</option>
                            <option value="food">Food</option>
                            <option value="nature">Nature</option>
                            <option value="other">Other</option>
                        </select>
                        <button onClick={props.upload}>Upload</button>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

export default App;
