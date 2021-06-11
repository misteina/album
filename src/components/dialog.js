import React from 'react';

export default function UploadDialog(props) {
    if (props.display) {
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