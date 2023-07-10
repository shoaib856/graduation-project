import React from "react";
import { Badge, Form, ListGroup } from "react-bootstrap";
import ShowOnHover from "./showOnHover";

const MarkMultiItems = ({
  formikProps,
  itemName,
  itemDescription,
  itemPrice = null,
  itemType,
  formikValues,
}) => {
  return (
    <ListGroup.Item>
      <ShowOnHover description={itemDescription}>
        <Form.Check className="flex gap-2" type="checkbox" id={itemName}>
          <Form.Check.Input
            className="cursor-pointer w-5 h-5 my-auto checked:bg-emerald-600 checked:border-emerald-300 shadow-none border-gray-300 focus:border-emerald-300"
            type="checkbox"
            id={itemName}
            name={itemType}
            {...formikProps(itemType)}
            value={itemName}
            checked={formikValues[itemType].includes(itemName)}
          />
          <Form.Check.Label className="grow cursor-pointer">
            {itemName}
          </Form.Check.Label>

          {itemPrice && (
            <Badge className="p-1 !bg-emerald-300 flex justify-center items-center">
              ${itemPrice}
            </Badge>
          )}
        </Form.Check>
      </ShowOnHover>
    </ListGroup.Item>
  );
};

export default MarkMultiItems;
