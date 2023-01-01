"use client";

import LABELS from "@app-datasets/coco/classes.json";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Container,
  Heading,
  Icon,
  Text,
  useBoolean,
  VisuallyHiddenInput,
  VStack,
} from "@app-providers/chakra-ui";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ZOO_MODEL = [{ name: "yolov5", child: ["yolov5n", "yolov5s"] }];

function Home() {
  const [model, setModel] = useState(null);
  const [aniId, setAniId] = useState(null);
  const [modelName, setModelName] = useState(ZOO_MODEL[0]);
  const [loading, setLoading] = useState(0);

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputImageRef = useRef(null);

  const [singleImage, setSingleImage] = useBoolean();
  const [liveWebcam, setliveWebcam] = useBoolean();

  useEffect(() => {
    tf.loadGraphModel(`/model/${modelName.name}/${modelName.child[1]}/model.json`, {
      onProgress: (fractions) => {
        setLoading(fractions);
      },
    }).then(async (mod) => {
      // warming up the model before using real data
      const dummy = tf.ones(mod.inputs[0].shape);
      const res = await mod.executeAsync(dummy);

      // clear memory
      tf.dispose(res);
      tf.dispose(dummy);

      // save to state
      setModel(mod);
    });
  }, [modelName]);

  // helper for drawing into canvas
  const renderPrediction = (boxesData, scoresData, classesData) => {
    const ctx = canvasRef.current.getContext("2d");

    // clean canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    for (let i = 0; i < scoresData.length; ++i) {
      const klass = LABELS[classesData[i]];
      const score = (scoresData[i] * 100).toFixed(1);

      let [x1, y1, x2, y2] = boxesData.slice(i * 4, (i + 1) * 4);
      x1 *= canvasRef.current.width;
      x2 *= canvasRef.current.width;
      y1 *= canvasRef.current.height;
      y2 *= canvasRef.current.height;
      const width = x2 - x1;
      const height = y2 - y1;

      // draw the bounding box
      ctx.strokeStyle = "#C53030";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);

      const label = klass + " - " + score + "%";
      const textWidth = ctx.measureText(label).width;
      const textHeight = parseInt(font, 10); // base 10

      // draw the label background
      ctx.fillStyle = "#C53030";
      ctx.fillRect(x1 - 1, y1 - (textHeight + 4), textWidth + 6, textHeight + 4);

      // draw the label text
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(label, x1 + 2, y1 - (textHeight + 2));
    }
  };

  // handler to predict in a single image
  const predictImage = async () => {
    if (!model) return;

    tf.engine().startScope();

    // get width and height from model's shape for resizing image
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

    // pre-processing image
    const input = tf.tidy(() => {
      const imageTensor = tf.browser.fromPixels(imageRef.current);
      return tf.image.resizeBilinear(imageTensor, [modelWidth, modelHeight]).div(255.0).expandDims(0);
    });

    // predicting...
    const res = await model.executeAsync(input);

    const [boxes, scores, classes] = res;
    const boxesData = boxes.dataSync();
    const scoresData = scores.dataSync();
    const classesData = classes.dataSync();

    // build the predictions data
    renderPrediction(boxesData, scoresData, classesData);

    // for (let i = 0; i < validDetectionsData[0]; i++) {
    //   const [x1, y1, x2, y2] = boxesData.slice(i * 4, (i + 1) * 4);

    //   const labelText = `${LABELS[classesData[i]]} - ${(scoresData[i] * 100).toFixed(1)}%`;
    //   const labelNode = document.createTextNode(labelText);

    //   const labelBgNode = document.createElement("div");
    //   labelBgNode.id = "prediction-label";
    //   labelBgNode.style.position = "absolute";
    //   labelBgNode.style.left = "1px";
    //   labelBgNode.style.top = "1px";
    //   labelBgNode.style.color = "#fff";
    //   labelBgNode.style.padding = "0.2rem";
    //   labelBgNode.style.whiteSpace = "nowrap";
    //   labelBgNode.style.textTransform = "uppercase";
    //   labelBgNode.style.fontSize = "0.6rem";
    //   labelBgNode.style.backgroundColor = "#c53030";
    //   labelBgNode.appendChild(labelNode);

    //   const bboxNode = document.createElement("div");
    //   bboxNode.id = `prediction-rect-${i}`;
    //   bboxNode.style.position = "absolute";
    //   bboxNode.style.left = (x1 * 100).toFixed(1) + "%";
    //   bboxNode.style.top = (y1 * 100).toFixed(1) + "%";
    //   bboxNode.style.width = ((x2 - x1) * 100).toFixed(1) + "%";
    //   bboxNode.style.height = ((y2 - y1) * 100).toFixed(1) + "%";
    //   bboxNode.style.border = "2px solid #c53030";
    //   bboxNode.appendChild(labelBgNode);

    //   // create prediction node
    //   document.getElementById("prediction-placeholder").appendChild(bboxNode);
    // }

    // clear memory
    tf.dispose(res);

    tf.engine().endScope();
  };

  // handler to predict per video frame
  const predictFrame = async () => {
    if (!model) return;
    if (!videoRef.current || !videoRef.current.srcObject) return;

    tf.engine().startScope();

    // get width and height from model's shape for resizing image
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

    // pre-processing frame
    const input = tf.tidy(() => {
      const frameTensor = tf.browser.fromPixels(videoRef.current);
      return tf.image.resizeBilinear(frameTensor, [modelWidth, modelHeight]).div(255.0).expandDims(0);
    });

    // predicting...
    const res = await model.executeAsync(input);

    const [boxes, scores, classes] = res;
    const boxesData = boxes.dataSync();
    const scoresData = scores.dataSync();
    const classesData = classes.dataSync();

    // build the predictions data
    renderPrediction(boxesData, scoresData, classesData);

    // clear memory
    tf.dispose(res);

    const reqId = requestAnimationFrame(predictFrame);
    setAniId(reqId);

    tf.engine().endScope();
  };

  // handler while uploading single image
  const imageHandler = (e) => {
    const file = e.target.files[0];

    if (file === null || file === undefined) {
      return;
    }

    const src = window.URL.createObjectURL(file);
    imageRef.current.src = src;
    setSingleImage.toggle();

    imageRef.current.onload = () => {
      predictImage();
      window.URL.revokeObjectURL(src);
    };
  };

  // handler while activating webcam
  const webcamHandler = async () => {
    if (!navigator.mediaDevices) return;
    if (!navigator.mediaDevices.getUserMedia) return;

    const media = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "environment",
      },
    });

    videoRef.current.srcObject = media;
    setliveWebcam.toggle();
    videoRef.current.onloadedmetadata = () => {
      predictFrame();
    };
  };

  return (
    <Container as="main">
      <Center
        width="full"
        height="full"
        display={model ? "none" : "flex"}
        color="white"
        bgColor="blackAlpha.800"
        position="absolute"
        top={0}
        left={0}
        zIndex={999}
        cursor="progress"
      >
        {`Loading model... ${(loading * 100).toFixed(1)}%`}
      </Center>
      <VStack spacing={8} minHeight="calc(100vh - 4rem - 164px)" justifyContent="center" alignItems="center">
        <VStack spacing={4} maxW={640}>
          <Heading>Tensorflow.js Example</Heading>
          <Text textAlign="center">
            This object detection project uses the YOLOv5 model which has been converted to Tensorflow.js format
            for edge computing.
          </Text>
        </VStack>

        <VStack spacing={0}>
          <UploadLayer display={!singleImage && !liveWebcam ? "flex" : "none"} />
          <Box
            id="image-placeholder"
            width={640}
            position="relative"
            bgImage={`url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='%23E4E6ED' stroke-width='4' stroke-dasharray='4, 12' stroke-linecap='square'/%3E%3C/svg%3E")`}
            display={singleImage || liveWebcam ? "flex" : "none"}
          >
            <chakra.img
              ref={imageRef}
              src="#"
              width="full"
              alt="Image Placeholder"
              display={singleImage && !liveWebcam ? "block" : "none"}
            />
            <chakra.video
              ref={videoRef}
              width="full"
              autoPlay
              playsInline
              muted
              display={liveWebcam && !singleImage ? "block" : "none"}
            />
            <canvas ref={canvasRef} width={640} height={640} />
            {/* <Box id="prediction-placeholder" /> */}
            <Icon
              as={FaTimes}
              color="white"
              bgColor="red.600"
              boxSize={6}
              position="absolute"
              zIndex={1}
              top={0}
              right={0}
              cursor="pointer"
              display={singleImage || liveWebcam ? "block" : "none"}
              onClick={() => {
                if (singleImage) {
                  imageRef.current.src = "#";
                  inputImageRef.current.value = "";
                  setSingleImage.toggle();
                }
                if (liveWebcam && videoRef.current.srcObject) {
                  cancelAnimationFrame(aniId);
                  setAniId(null);
                  videoRef.current.srcObject = null;
                  setliveWebcam.toggle();
                }
                // clear earlier detections data
                // document.getElementById("prediction-placeholder").replaceChildren();
              }}
              aria-hidden="true"
            />
          </Box>
        </VStack>

        <ButtonGroup>
          <VisuallyHiddenInput ref={inputImageRef} type="file" accept="image/*" onChange={imageHandler} />
          <Button disabled={singleImage || liveWebcam} onClick={() => inputImageRef.current.click()}>
            Single Image
          </Button>
          <Button disabled={liveWebcam || singleImage} onClick={webcamHandler}>
            Live Webcam
          </Button>
          <Button>Settings</Button>
        </ButtonGroup>
      </VStack>
    </Container>
  );
}

function UploadLayer({ ...restProps }) {
  return (
    <Center
      width={640}
      height={320}
      bgImage={`url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='%23E4E6ED' stroke-width='4' stroke-dasharray='4, 12' stroke-linecap='square'/%3E%3C/svg%3E")`}
      {...restProps}
    >
      <Icon focusable="false" viewBox="0 0 512 512" boxSize={128} fill="gray.200" aria-hidden="true">
        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"></path>
      </Icon>
    </Center>
  );
}

export default Home;
