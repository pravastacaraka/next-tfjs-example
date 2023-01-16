import DefaultTags from "@app-components/head/default-tags";

function RootHead() {
  return (
    <>
      <title>Tensorflow.js Example</title>
      <meta
        name="description"
        content="This object detection project uses the YOLOv5 model which has been converted to Tensorflow.js format for edge computing."
      />
      <DefaultTags />
    </>
  );
}

export default RootHead;
