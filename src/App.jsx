import { useState, useEffect } from "react";
import "./App.css";
import "./assets/scss/style.scss";

import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";

const App = () => {
  const [imageList, setImageList] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertDetails({ ...alertDetails, open: false });
  };

  const getRandomImages = () => {
    setAlertDetails({
      ...alertDetails,
      open: true,
      message: "Fetching Images",
    });
    axios
      .get("https://picsum.photos/v2/list")
      .then((response) => response.data)
      .then((res) => {
        // add propery isLoaded
        res.forEach((img) => {
          img.isLoaded = false;
        });

        setImageList(res);
      });
  };

  const handleAddImage = () => {
    const randomImageId = Math.floor(Math.random() * 100) + imageList.length;
    setDisplayLoader(true);
    setAlertDetails({
      ...alertDetails,
      open: true,
      message: "Fetching Random Image",
      severity: "info",
    });
    axios
      .get(`https://picsum.photos/id/${randomImageId}/info`)
      .then((response) => response.data)
      .then((res) => {
        res.isLoaded = false;
        setImageList((n) => [...n, res]);
        setDisplayLoader(false);
      });
  };

  const handleRemoveImage = () => {
    if (imageList.length === 0) return;
    const randomImageId = Math.floor(Math.random() * imageList.length);
    const list = [...imageList];
    list.splice(randomImageId, 1);
    setImageList(list);
    setAlertDetails({
      ...alertDetails,
      open: true,
      message: "Random Image Removed",
      severity: "success",
    });
  };

  const handleDoneImageLoading = (id) => {
    const list = [...imageList];
    const img = list.find((n) => n.id === id);
    img.isLoaded = true;
    setImageList(list);
  };

  useEffect(() => {
    getRandomImages();
  }, []);

  useEffect(() => {
    const notLoadedImages = imageList.filter((n) => n.isLoaded === false);
    if (imageList.length !== 0 && notLoadedImages.length === 0) {
      setAlertDetails({
        ...alertDetails,
        open: true,
        message: "Images Loaded",
        severity: "success",
      });
    }
  }, [imageList]);

  return (
    <Box className="main">
      <div className="img-list">
        {imageList.map((img) => (
          <div key={img.id} className="img-cont">
            <img
              width={150}
              height={150}
              alt={`${img.author}-${img.id}`}
              src={img.download_url}
              onLoad={() => handleDoneImageLoading(img.id)}
            />
            {img.isLoaded === false && (
              <Skeleton variant="rectangle" width={150} height={150} />
            )}
          </div>
        ))}
      </div>
      <Box className="img-updater">
        <Button
          variant="contained"
          onClick={handleAddImage}
          className="btn-add"
          disableElevation
        >
          {displayLoader ? <CircularProgress /> : "Add Image"}
        </Button>
        <Button
          variant="contained"
          onClick={handleRemoveImage}
          className="btn-remove"
          disableElevation
        >
          Remove Random Image
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={alertDetails.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity={alertDetails.severity}>{alertDetails.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
