import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ConfirmModal = ({ item, show, setShow, deleteCart }) => {
  const handleClose = () => {
    setShow(false);
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>삭제 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>해당 상품을 삭제하시겠습니까??</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
          }}
        >
          아니요
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleClose();
            deleteCart(item._id);
          }}
        >
          예
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
