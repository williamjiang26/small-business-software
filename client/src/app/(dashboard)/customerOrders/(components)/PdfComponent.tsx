import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { useDropzone } from "react-dropzone";

const PDFComponent = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf", // Only accept PDF files
  });

  const handleDelete = () => {
    setFile(null); // Reset to drag-and-drop field
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      {!file ? (
        <div
          {...getRootProps()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <input {...getInputProps()} />
          <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
            Drop here, or Browse
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Document
            file={file}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Page pageNumber={1} />
          </Document>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFComponent;
