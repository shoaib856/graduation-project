// create a custom accordion component
import {Accordion} from "react-bootstrap";

const CustomAccordion = ({header, children,eventKey}) => {
    return (
        <Accordion.Item className={"!shadow-none relative"} eventKey={eventKey}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body className={"relative"}>
                {children}
            </Accordion.Body>
        </Accordion.Item>

    );

}

export default CustomAccordion;
