/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button, ButtonGroup, Tabs, Tab } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import axios from "axios";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useContext } from "react";
import { Table, Modal } from "@geist-ui/core";

const XplorePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [acceptedFiles, setAcceptedFiles] = React.useState([]);
  const [apiResponse, setApiResponse] = React.useState(null);

  const [modals, setModals] = React.useState({
    original: false,
    preprocessed: false,
  });

  const onDrop = useCallback((acceptedFiles) => {
    setAcceptedFiles(acceptedFiles);
    getApiResponse(acceptedFiles[0]);
  }, []);

  const getApiResponse = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://hakdit-lensxplore-7545bd9a2a50.herokuapp.com/uploadvideo",
        formData
      );

      console.log(res.data);
      setApiResponse(res.data);
      const d = Date.now();
      const pre = ref(storage, `${currentUser.uid}/${d}/preprocessed.jpg`);
      const sharp = ref(storage, `${currentUser.uid}/${d}/sharp.jpg`);

      await uploadString(pre, res.data.sharpest_frame, "data_url", {
        contentType: "image/jpeg",
      });
      await uploadString(sharp, res.data.preprocessed_image, "data_url", {
        contentType: "image/jpeg",
      });

      const downPre = await getDownloadURL(pre);
      const downSharp = await getDownloadURL(sharp);

      await updateDoc(doc(db, "users", currentUser.uid), {
        previous_uploads: arrayUnion({
          output: res.data.results,
          preprocessed: downPre,
          sharp: downSharp,
          timestamp: d,
        }),
      });
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/*",
    maxFiles: 1,
    multiple: false,
  });

  useEffect(() => {
    if (currentUser == null) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="min-h-[calc(100vh-7rem)]">
      <Tabs>
        <Tab
          key="upload"
          title="Upload Video"
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="w-full border border-muted h-28">
                Drop the files here ...
              </div>
            ) : (
              <div className="w-full border border-muted h-96 flex justify-center items-center rounded-md mb-5">
                Drag 'n' drop some files here, or click to select files
              </div>
            )}

            {acceptedFiles.map((file) => (
              <div
                className="w-full flex justify-center border border-muted py-10 rounded-md mb-5 flex-col items-center"
                key={file.path}
              >
                <span className="text-center">
                  {file.name} has been uploaded! Please move onto the next tab
                  to validate the video.{" "}
                </span>
                <span
                  className="text-primary cursor-pointer"
                  onClick={() =>
                    setAcceptedFiles((prev) => {
                      return prev.filter((item) => item.path !== file.path);
                    })
                  }
                >
                  Remove this file
                </span>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          title="Validate Video"
          key="validate"
          disabled={apiResponse == null}
        >
          {apiResponse != null && (
            <div className="flex flex-col">
              <Table
                className="bg-black hover:bg-black rounded"
                data={apiResponse.results.items.map((item) => ({
                  gst_number: apiResponse.results.gst_number,
                  classification: apiResponse.results.classification,
                  vendor: apiResponse.results.vendor,
                  bill_number: apiResponse.results.bill_number,
                  bill_date: apiResponse.results.bill_date,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  taxes: item.taxes.map((tax) => (
                    <>
                      {tax.name}: {tax.rate} ({tax.percentage}) - ₹{tax.amount}
                      <br />
                    </>
                  )),
                  grand_total: apiResponse.results.grand_total,
                }))}
              >
                <Table.Column
                  prop="gst_number"
                  label="GST Number"
                />
                <Table.Column
                  prop="classification"
                  label="Classification"
                />
                <Table.Column
                  prop="vendor"
                  label="Vendor"
                />
                <Table.Column
                  prop="bill_number"
                  label="Bill Number"
                />
                <Table.Column
                  prop="bill_date"
                  label="Bill Date"
                />
                <Table.Column
                  prop="name"
                  label="Item Name"
                />
                <Table.Column
                  prop="quantity"
                  label="Quantity"
                />
                <Table.Column
                  prop="price"
                  label="Price"
                />
                <Table.Column
                  prop="taxes"
                  label="Taxes"
                />
                <Table.Column
                  prop="grand_total"
                  label="Grand Total"
                />
              </Table>

              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>

              <ButtonGroup>
                <Button
                  onClick={() => {
                    setModals(() => ({
                      preprocessed: false,
                      original: true,
                    }));
                  }}
                  className="flex-1"
                >
                  Show original image
                </Button>
                <Button
                  onClick={() => {
                    setModals(() => ({
                      original: false,
                      preprocessed: true,
                    }));
                  }}
                  className="flex-1"
                >
                  Show preprocessed image
                </Button>
              </ButtonGroup>

              <Modal
                className="w-full"
                visible={modals.original}
                title="Original Image"
              >
                <img
                  className="aspect-auto"
                  src={apiResponse.sharpest_frame}
                  alt="preprocessed"
                />
              </Modal>

              <Modal
                className="w-full"
                visible={modals.preprocessed}
                title="Processed Image"
              >
                <img
                  className="aspect-auto"
                  src={apiResponse.preprocessed_image}
                  alt="sharpest"
                />
              </Modal>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default XplorePage;
