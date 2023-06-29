import React from "react";
import { CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";

const Stepper = ({
  steps,
  activeStep,
  setActiveStep,
  errors,
  touched,
  fieldsInEachStep,
}) => {
  const isStepValid = (step) => {
    let isValid = true;
    for (let i = 0; i < fieldsInEachStep[step].length; i++) {
      if (
        errors[fieldsInEachStep[step][i]] &&
        touched[fieldsInEachStep[step][i]]
      ) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };
  const filledStep = (step) => {
    let isFilled = true;
    for (let i = 0; i < fieldsInEachStep[step].length; i++) {
      if (
        !touched[fieldsInEachStep[step][i]] &&
        errors[fieldsInEachStep[step][i]]
      ) {
        isFilled = false;
        break;
      }
    }
    return isFilled;
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-lg mb-2">
      {steps.map((step, index) => (
        <>
          <button
            type="button"
            key={index}
            className={`flex items-center px-2 h-12 rounded-lg cursor-pointer ${
              activeStep === index + 1
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => setActiveStep(index + 1)}
          >
            <div
              className={`text-2xl font-semibold mr-2 w-8 h-8 rounded-full border-2 ${
                activeStep > index + 1 && !filledStep(index)
                  ? "border-orange-500"
                  : !isStepValid(index)
                  ? "border-red-600"
                  : activeStep === index + 1
                  ? "border-gray-200"
                  : " border-emerald-600"
              } flex justify-center items-center`}
            >
              {activeStep > index + 1 && !filledStep(index) ? (
                <ExclamationCircleFill className="text-orange-500 text-3xl" />
              ) : activeStep > index + 1 && isStepValid(index) ? (
                <CheckCircleFill className="text-emerald-600 text-3xl" />
              ) : activeStep > index + 1 && !isStepValid(index) ? (
                <ExclamationCircleFill className="text-red-600 text-3xl" />
              ) : (
                index + 1
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {index === 0
                  ? "First Step"
                  : index === 1
                  ? "Second Step"
                  : "Third Step"}
              </h3>
              <p className="text-xs">{step}</p>
            </div>
          </button>
          {index !== steps.length - 1 && (
            <div
              className={`w-24 h-1 rounded-full ${
                activeStep > index + 1 ? "bg-emerald-600" : "bg-gray-200"
              }`}
            ></div>
          )}
        </>
      ))}
    </div>
  );
};

export default Stepper;
