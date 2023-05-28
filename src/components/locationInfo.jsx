import { Alert, Form } from "react-bootstrap";

const LocationInfo = ({ errors, touched, formikProps }) => {
  return (
    <>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("country")}
          type="text"
          className="form-field"
          placeholder="Country Location"
          autoComplete="address-line2"
          id="country"
          required
        />
        <Form.Label htmlFor="country">Country Location</Form.Label>
        {touched.country && errors.country && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.country}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("state")}
          type="text"
          className="form-field"
          placeholder="State Location"
          autoComplete="address-line1"
          id="state"
          required
        />
        <Form.Label htmlFor="state">State Location</Form.Label>
        {touched.state && errors.state && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.state}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("city")}
          type="text"
          className="form-field"
          placeholder="City Location"
          autoComplete="address-line3"
          id="city"
          required
        />
        <Form.Label htmlFor="city">City Location</Form.Label>
        {touched.city && errors.city && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.city}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("streetName")}
          type="text"
          className="form-field"
          placeholder="Street Name"
          autoComplete="address-line4"
          id="streetName"
          required
        />
        <Form.Label htmlFor="street">Street Name</Form.Label>
        {touched.street && errors.street && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.street}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          id="postCode"
          type="text"
          {...formikProps("postCode")}
          className=" form-field"
          placeholder="Post Code"
          autoComplete="address-line5"
          required
        />
        <Form.Label htmlFor="postCode">Post Code</Form.Label>
        {touched.postCode && errors.postCode && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.postCode}
          </Alert>
        )}
      </Form.FloatingLabel>
    </>
  );
};
export default LocationInfo;
