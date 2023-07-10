import React from "react";
import { Container } from "react-bootstrap";
import { CheckCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const PurchaseSucceeded = () => {
  return (
    <Container fluid>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="text-center text-7xl sm:text-4xl font-semibold text-emerald-600" />
          </div>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-emerald-900 sm:text-5xl">
            Purchase Succeeded
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Thank you for your purchase. You will receive an email with your
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Go back home
            </Link>
            <Link
              to="/contact"
              className="text-sm font-semibold text-gray-900 hover:text-emerald-400"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default PurchaseSucceeded;
