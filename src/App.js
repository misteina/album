import React from 'react';
import UploadDialog from './components/dialog';
import './App.css';

function App() {

    const [state, setState] = React.useState({
        uploadDialog: false,
        uploadStatus: 'No file(s) selected',
        files: [],
        album: 'select',
        formData: null,
        photos: [],
        skip: 0,
        deletePhotos: [],
        page: 1
    });

    React.useEffect(() => {
        fetch('http://localhost:8888/photos/list', {
            method: 'POST',
            body: JSON.stringify({ skip: state.skip, limit: 20 }),
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
                    if (data.message === 'OK'){
                        alert(status);
                    }
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

    const previousPage = () => {
        if (state.skip > 0){
            setState(state => ({
                ...state,
                page: state.page - 1,
                skip: state.skip < 20 ? 0 : state.skip - 20
            }));
        }
    }

    const nextPage = () => {
        if (state.photos.length === 20){
            setState(state => ({
                ...state,
                page: state.page + 1,
                skip: state.skip + 20
            }));
        }
    }

    const checkForDelete = (e) => {
        const name = e.target.parentNode.querySelectorAll('b')[0].innerText;
        const album = e.target.parentNode.querySelectorAll('span')[0].innerText;
        let findAlbum = false;
        const deletePhotos = [...state.deletePhotos];
        for (let i = 0; i < deletePhotos.length; i++){
            if (e.target.checked) {
                if (deletePhotos[i].album === album) {
                    findAlbum = true;
                    deletePhotos[i].documents = deletePhotos[i].documents.split(',');
                    if (!deletePhotos[i].documents.includes(name)) {
                        deletePhotos[i].documents.push(name);
                        deletePhotos[i].documents = deletePhotos[i].documents.join(',');
                    }
                    break;
                }
            } else {
                if (deletePhotos[i].album === album){
                    deletePhotos[i].documents = deletePhotos[i].documents.split(',');
                    let index = deletePhotos[i].documents.indexOf(name);
                    if (index >= 0){
                        deletePhotos[i].documents.splice(index, 1);
                        deletePhotos[i].documents = deletePhotos[i].documents.join(',');
                        if (deletePhotos[i].documents.length === 0) {
                            deletePhotos.splice(i, 1);
                        }
                    }
                    break;
                }
            }
        }
        if (e.target.checked && !findAlbum) {
            deletePhotos.push({ album: album, documents: name });
        }
        setState(state => ({
            ...state,
            deletePhotos: deletePhotos
        }));
        console.log(deletePhotos)
    }

    const deleteImages = () => {
        if (state.deletePhotos.length > 0){
            fetch('http://localhost:8888/photos', {
                method: 'DELETE',
                body: JSON.stringify(state.deletePhotos),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(
                res => res.json()
            ).then(
                (data) => {
                    if (data.message === 'OK') {
                        const photos = [...state.photos];
                        const deletePhotos = [...state.deletePhotos];
                        for (let i = 0;i < photos.length;i++){
                            for (let j = 0;j < deletePhotos.length;j++){
                                if (
                                    photos[i].album === deletePhotos[j].album && 
                                    deletePhotos[j].documents.includes(photos[i].name.split('/').pop()) 
                                ){
                                    photos.splice(i, 1);
                                }
                            }
                        }
                        setState(state => ({
                            ...state,
                            deletePhotos: [],
                            photos: photos
                        }));
                    }
                },
                (error) => {
                    console.error(error)
                }
            );
        } else {
            alert(`You have not selected any photo(s) to delete. Please move the mouse pointer around the top left area of the photo boxes to select photo(s) to delete`);
        }
    }

    return (
        <React.Fragment>
            <header>
                <span>Photos</span>
                <div>
                    <button onClick={previousPage}>&#12296;</button>
                    Page {state.page}
                    <button onClick={nextPage}>&#12297;</button>
                </div>
                <div>
                    <div onClick={openUploadDialog}>Upload</div>|
                    <div onClick={deleteImages}>Delete</div>
                </div>
            </header>
            <main>
                {
                    state.photos.map((photo) => 
                        <div key={photo.id}>
                            <div><img src={photo.raw} alt={photo.name} /></div>
                            <div>
                                <b>{photo.name.split('/').pop()}</b><br /><span>{photo.album}</span>
                            </div>
                            <input type="checkbox" onChange={checkForDelete} />
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

export default App;