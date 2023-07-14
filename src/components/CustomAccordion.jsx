// create a custom accordion component
import {Accordion} from "react-bootstrap";

const CustomAccordion = ({header, children,eventKey}) => {
    return (
        <Accordion.Item className={"!shadow-none"} eventKey={eventKey}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body>
                {children}
            </Accordion.Body>
        </Accordion.Item>

    );

}

export default CustomAccordion;
