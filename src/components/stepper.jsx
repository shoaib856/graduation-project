import React from "react";
import { CheckCircleFill } from "react-bootstrap-icons";

const Stepper = ({ steps, activeStep, setActiveStep }) => {
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
                activeStep === index + 1
                  ? "border-gray-200"
                  : " border-emerald-600"
              } flex justify-center items-center`}
            >
              {activeStep > index + 1 ? (
                <CheckCircleFill className="text-emerald-600 text-3xl" />
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
