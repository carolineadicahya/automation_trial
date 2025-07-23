import {
  HomeIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import React from "react";
import TablePage from "@/pages/dashboard/TablePage";
import ImportBarang from "@/pages/dashboard/ImportBarang";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Barang",
        path: "/barang",
        element: <TablePage resourceKey="barang" resourceLabel="Barang" columns={[
          { key: "part_number", label: "Part Number" },
          { key: "deskripsi", label: "Deskripsi" },
          { key: "hs_code", label: "HS Code" },
          { key: "pos_tarif", label: "Pos Tarif" },
          { key: "status_lartas", label: "Status Lartas" },
        ]} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "PIB",
        path: "/pib",
        element: <TablePage resourceKey="pib" resourceLabel="PIB" columns={[
          { key: "id", label: "ID" },
          // Add more PIB columns as needed
        ]} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Import Barang",
        path: "/import-barang",
        element: <ImportBarang />,
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
