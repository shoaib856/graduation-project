import { Alert, Col, Form, Row } from "react-bootstrap";

const GeneralInfo = ({ errors, touched, formikProps }) => {
  return (
    <>
      <Row className="mb-2">
        <Form.FloatingLabel label="First Name" as={Col} className="pr-1">
          <Form.Control
            {...formikProps("firstName")}
            autoComplete="nope"
            id="firstName"
            type="text"
            placeholder="First Name"
            className="form-field"
            required
          />
          
          {touched.firstName && errors.firstName && (
            <Alert
              variant="danger"
              className="mt-2 px-1 py-2 border-l-8 !text-sm"
            >
              {errors.firstName}
            </Alert>
          )}
        </Form.FloatingLabel>
        <Form.FloatingLabel label="Last Name" as={Col} className="pl-1">
          <Form.Control
            {...formikProps("lastName")}
            id="lastName"
            placeholder="Last Name"
            autoComplete="nope"
            type="text"
            className="form-field"
            required
          />
          
          {touched.lastName && errors.lastName && (
            <Alert
              variant="danger"
              className="mt-2 px-1 py-2 border-l-8 !text-sm"
            >
              {errors.lastName}
            </Alert>
          )}
        </Form.FloatingLabel>
      </Row>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          id="userName"
          {...formikProps("userName")}
          autoComplete="nope"
          type="text"
          className="form-field"
          placeholder="User Name"
          required
        />
        <Form.Label htmlFor="user">UserName</Form.Label>
        {touched.userName && errors.userName && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.userName}
          </Alert>
        )}
      </Form.FloatingLabel>

      <Form.FloatingLabel className="mb-2">
        <Form.Control
          id="email"
          {...formikProps("email")}
          autoComplete="nope"
          type="email"
          className="form-field"
          placeholder="Email"
          required
        />
        <Form.Label htmlFor="email">E-mail</Form.Label>
        {touched.email && errors.email && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.email}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          id="password"
          {...formikProps("password")}
          type="password"
          placeholder="Password"
          className="form-field"
          autoComplete="off"
          required
        />
        <Form.Label htmlFor="password">Password</Form.Label>
        {touched.password && errors.password && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.password}
          </Alert>
        )}
      </Form.FloatingLabel>

      <Form.FloatingLabel className="mb-2">
        <Form.Control
          id="confirmPassword"
          {...formikProps("confirmPassword")}
          type="password"
          className="form-field"
          placeholder="Confirm Password"
          autoComplete="new-password"
          required
        />
        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
        {touched.confirmPassword && errors.confirmPassword && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.confirmPassword}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("phoneNumber")}
          id="phoneNumber"
          type="text"
          className="form-field"
          placeholder="Phone Number"
          autoComplete="nope"
          required
        />
        <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
        {touched.phoneNumber && errors.phoneNumber && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.phoneNumber}
          </Alert>
        )}
      </Form.FloatingLabel>
    </>
  );
};
export default GeneralInfo;
