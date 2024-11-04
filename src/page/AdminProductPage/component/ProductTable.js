import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";
import ConfirmModal from "../../../common/component/ConfirmModal";

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  const [show, setShow] = useState(false);
  console.log("data", data);
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data
              .slice(0)
              .reverse()
              .map((item, index) => (
                <tr key={index}>
                  <th>{index}</th>
                  <th>{item.sku}</th>
                  <th style={{ minWidth: "100px" }}>{item.name}</th>
                  <th>{currencyFormat(item.price)}</th>
                  <th>
                    {Object.keys(item.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{item.stock[size]}
                      </div>
                    ))}
                  </th>
                  <th>
                    <img src={item.image} width={100} alt="image" />
                  </th>
                  <th>{item.status}</th>
                  <th style={{ minWidth: "100px" }}>
                    <Button
                      size="sm"
                      variant="danger"
                      // onClick={() => deleteItem(item._id)}
                      onClick={() => {
                        setShow(true);
                      }}
                      className="mr-1"
                    >
                      -
                    </Button>
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                    <ConfirmModal
                      item={item}
                      show={show}
                      setShow={setShow}
                      deleteFunction={deleteItem}
                    />
                  </th>
                </tr>
              ))
          ) : (
            <tr>No Data to show</tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductTable;
