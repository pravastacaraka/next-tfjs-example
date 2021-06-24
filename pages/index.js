import { Box, Center, Flex, Text, VisuallyHiddenInput } from "@chakra-ui/react";
import * as tf from "@tensorflow/tfjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const BG_UPLOAD = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='%23E4E6ED' stroke-width='4' stroke-dasharray='4, 12' stroke-linecap='square'/%3E%3C/svg%3E")`;
const WEIGHTS = "https://storage.googleapis.com/smart-odontogram/weights/model.json";
const LABELS = ["sehat", "lubang", "amalgam", "komposit", "hilang"];
const [MODEL_WIDTH, MODEL_HEIGHT] = [320, 320];

export default function Home() {
  const [dataPredict, setDataPredict] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [isHover, setHover] = useState(false);

  // Handler load model
  const run = async () => {
    const model = await tf.loadGraphModel(WEIGHTS);
    setTimeout(() => detect(model), 10);
  };

  // Handler for object detection
  const detect = (net) => {
    const imagePlaceholder = document.getElementsByClassName("preview-img")[0];
    const input = tf.image
      .resizeBilinear(tf.browser.fromPixels(imagePlaceholder), [MODEL_WIDTH, MODEL_HEIGHT])
      .div(255.0)
      .expandDims(0);
    net.executeAsync(input).then((res) => setDataPredict(res));
  };

  // Handler for element clicker
  const clickHandler = (elementId) => {
    document.getElementById(elementId).click();
  };

  // Handler for uploading file
  const uploadHandler = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    // Let the app read file contents asynchronously
    if (reader !== undefined && file !== undefined) {
      reader.onloadend = function () {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    // Run prediction
    run();
  };

  return (
    <>
      <Head>
        <title>TensorFlow.js Inference with Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center as="main" h="100vh">
        <Flex className="object-detection" justifyContent="center" alignItems="center">
          <Flex
            className="detection-container"
            justifyContent="center"
            alignItems="center"
            padding="1em"
            cursor="pointer"
            position="relative"
            height="calc(320px + 40px)"
            width="calc(480px + 40px)"
            backgroundImage={BG_UPLOAD}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => clickHandler("file-input")}
          >
            {imagePreview ? (
              <PreviewContainer props={{ image: imagePreview, predict: dataPredict }} />
            ) : (
              <PromptContainer props={{ hover: isHover }} />
            )}
          </Flex>
          <VisuallyHiddenInput id="file-input" type="file" accept="image/*" onChange={(e) => uploadHandler(e)} />
        </Flex>
      </Center>
    </>
  );
}

function PromptContainer({ props }) {
  return (
    <Flex
      className="prompt-container"
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      w="100%"
      h="100%"
      pointerEvents="none"
    >
      <Box
        as="svg"
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="image"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        w={128}
        h={128}
        transition="0.3s"
        fill={props.hover ? "honoluluBlue.500" : "#e4e6ed"}
      >
        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"></path>
      </Box>
      <Box className="prompt" color="#868f9b" mt={4}>
        <Text>Drag and drop your image here, or</Text>
        <Text>
          <Box as="span" className="dialogue-link" color="black" textDecoration="underline">
            open
          </Box>{" "}
          from your computer{" "}
        </Text>
      </Box>
    </Flex>
  );
}

function PreviewContainer({ props }) {
  let dataPredictions = [];

  // Handler for drawing bounding boxes in preview image
  if (props.predict) {
    const [boxes, scores, classes, valid_detections] = props.predict;

    // Aggregate result
    for (let i = 0; i < valid_detections.dataSync()[0]; ++i) {
      const [x1, y1, x2, y2] = boxes.dataSync().slice(i * 4, (i + 1) * 4);
      dataPredictions.push({
        score: scores.dataSync()[i].toFixed(2),
        label: LABELS[classes.dataSync()[i]],
        x: (x1 * 100).toFixed(2) + "%",
        y: (y1 * 100).toFixed(2) + "%",
        width: ((x2 - x1) * 100).toFixed(2) + "%",
        height: ((y2 - y1) * 100).toFixed(2) + "%",
      });
    }
  }

  return (
    <Flex
      className="preview-container"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      position="relative"
    >
      <Box className="preview" w={480} h={320}>
        <Image className="preview-img" src={props.image} layout="fill" alt="Image Preview" />
        {dataPredictions.length == 0 ? (
          <Center
            position="absolute"
            w="100%"
            h="100%"
            color="white"
            backgroundColor="rgba(0,0,0,0.8)"
            cursor="progress"
          >
            Detecting...
          </Center>
        ) : (
          dataPredictions.map((row, i) => {
            return <DetectionContainer key={i} props={row} />;
          })
        )}
      </Box>
    </Flex>
  );
}

function DetectionContainer({ props }) {
  return (
    <Box
      className="detection"
      position="absolute"
      left={props.x}
      top={props.y}
      w={props.width}
      h={props.height}
      borderWidth="2px"
      borderStyle="solid"
      borderColor="red"
    >
      <Box
        className="label"
        position="absolute"
        left="1px"
        top="1px"
        color="#fff"
        padding="0.2em"
        whiteSpace="nowrap"
        textTransform="uppercase"
        fontWeight="500"
        fontSize="0.8em"
        cursor="default"
        backgroundColor="red"
      >
        {props.label} - {props.score}
      </Box>
    </Box>
  );
}
