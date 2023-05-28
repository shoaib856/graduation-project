import { Button, Spinner } from "react-bootstrap";

function Btn({ model, isLoading, modelType }) {
  return (
    <Button
      className="max-w-fit flex items-center gap-2 !text-lg !border-none !bg-emerald-800 hover:!bg-emerald-500 focus:!shadow-none focus-visible:!shadow-none disabled:!bg-emerald-900"
      onClick={() => model(modelType)}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Processing
        </>
      ) : (
        `Process ${modelType}`
      )}
    </Button>
  );
}

export default Btn;
