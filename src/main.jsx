import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.scss";

import { RecoilRoot } from "recoil";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev/index.js";
import PurchaseFailed from "./pages/PurchaseFailed";
import Payments from "./pages/Payments";
import History from "./pages/History.jsx";

// layouts
const RootLayout = lazy(() => import("./layout/rootLayout"));
const DashboardLayout = lazy(() => import("./layout/dashboardLayout"));
const ProfileLayout = lazy(() => import("./layout/ProfileLayout"));
const FeaturesLayout = lazy(() => import("./layout/featuresLayout"));
const TagsLayout = lazy(() => import("./layout/tagLayout"));
const EditUserByAdminLayout = lazy(() =>
  import("./layout/EditUserByAdminLayout")
);

// basic pages without auth
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));

// auth
const Register = lazy(() => import("./pages/register"));

// dashboard
const Dashboard = lazy(() => import("./pages/dashboard"));
const AddFeature = lazy(() => import("./pages/AddFeature"));
const FeatureDetails = lazy(() => import("./pages/FeatureDetails"));
const AddTag = lazy(() => import("./pages/AddTag"));
const TagDetails = lazy(() => import("./pages/TagDetails"));
const Reports = lazy(() => import("./pages/Reports"));

// profile
const Profile = lazy(() => import("./pages/profile"));
const EditPwd = lazy(() => import("./pages/EditPwd"));
const Devices = lazy(() => import("./pages/Devices"));

// not found
const NotFound = lazy(() => import("./pages/NotFound"));

// plant disease app
const PlantDiseaseApp = lazy(() => import("./pages/plant-disease-app"));

// community
const CommunityLayout = lazy(() => import("./layout/CommunityLayout"));
const Community = lazy(() => import("./pages/Community"));

// pricing
const PricingLayout = lazy(() => import("./layout/PricingLayout"));
const PurchaseSucceeded = lazy(() => import("./pages/PurchaseSucceeded"));
const Pricing = lazy(() => import("./pages/Pricing"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "app",
        element: <PlantDiseaseApp />,
      },
      {
        path: "community",
        element: <CommunityLayout />,
        children: [
          {
            index: true,
            element: <Community />,
          },
        ],
      },
      {
        path: "pricing",
        element: <PricingLayout />,
        children: [
          {
            index: true,
            element: <Pricing />,
          },
          {
            path: "success",
            element: <PurchaseSucceeded />,
          },
          {
            path: "failed",
            element: <PurchaseFailed />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "edit-pwd",
            element: <EditPwd />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
          {
            path: "devices",
            element: <Devices />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "history",
            element: <History />,
          }
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "user-details/:id",
            element: <EditUserByAdminLayout />,
            children: [
              {
                index: true,
                element: <Profile />,
              },
              {
                path: "edit-pwd",
                element: <EditPwd />,
              },
            ],
          },
          {
            path: "add-user",
            element: <Register />,
          },
          {
            path: "features",
            element: <FeaturesLayout />,
            children: [
              {
                index: true,
                element: <AddFeature />,
              },
              {
                path: "feature-details/:id",
                element: <FeatureDetails />,
              },
            ],
          },
          {
            path: "tags",
            element: <TagsLayout />,
            children: [
              {
                index: true,
                element: <AddTag />,
              },
              {
                path: "tag-details/:id",
                element: <TagDetails />,
              },
            ],
          },
          {
            path: "reports",
            element: <Reports />,
          },
        ],
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <DevSupport
        ComponentPreviews={ComponentPreviews}
        useInitialHook={useInitial}
      >
        <RouterProvider router={router} />
      </DevSupport>
    </RecoilRoot>
  </React.StrictMode>
);
