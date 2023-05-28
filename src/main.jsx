import React, { lazy, startTransition } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.scss";

import { RecoilRoot } from "recoil";

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

// profile
const Profile = lazy(() => import("./pages/profile"));
const EditPwd = lazy(() => import("./pages/EditPwd"));
const UpdateUserImg = lazy(() => import("./pages/updateUserImg"));
const Devices = lazy(() => import("./pages/Devices"));

// not found
const NotFound = lazy(() => import("./pages/NotFound"));

// plant disease app
const PlantDiseaseApp = lazy(() => import("./pages/plant-disease-app"));

const router = createBrowserRouter([
  {
    path: "graduation-project/",
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
            path: "update-user-img",
            element: <UpdateUserImg />,
          },
          {
            path: "devices",
            element: <Devices />,
          },
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
              {
                path: "update-user-img",
                element: <UpdateUserImg />,
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
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
