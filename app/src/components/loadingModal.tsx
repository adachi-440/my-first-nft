import { Modal, useModal, Button, Text } from "@nextui-org/react";
import { NextPage } from "next";

const LoadingModal: NextPage = () => {
  const { setVisible, bindings } = useModal();

  return (
    <div>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Body>
        <iframe src="https://embed.lottiefiles.com/animation/89628"></iframe>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LoadingModal;
