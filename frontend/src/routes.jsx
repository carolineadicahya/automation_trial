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
      // Table menu for each backend table
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Barang",
        path: "/barang",
        element: <TablePage resourceKey="barang" resourceLabel="Barang" columns={[
          { key: "part_number", label: "Part Number" },
          { key: "hs_code", label: "HS Code" },
          { key: "deskripsi", label: "Deskripsi" },
          { key: "pos_tarif", label: "Pos Tarif" },
          { key: "status_lartas", label: "Status Lartas" },
          { key: "satuan", label: "Satuan" },
        ]} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Detail PIB",
        path: "/detail_pib",
        element: <TablePage resourceKey="detail_pib" resourceLabel="Detail PIB" columns={[
          { key: "id", label: "ID" },
          { key: "id_pib", label: "ID PIB" },
          { key: "jumlah", label: "Jumlah" },
          { key: "dimensi", label: "Dimensi" },
          { key: "mata_uang", label: "Mata Uang" },
          { key: "no_invoice", label: "No Invoice" },
          { key: "no_bl", label: "No BL" },
        ]} />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Importir",
      //   path: "/importir",
      //   element: <TablePage resourceKey="importir" resourceLabel="Importir" columns={[
      //     { key: "id", label: "ID" },
      //     { key: "nitku", label: "NITKU" },
      //     { key: "nib", label: "NIB" },
      //     { key: "alamat", label: "Alamat" },
      //   ]} />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Instansi",
        path: "/instansi",
        element: <TablePage resourceKey="instansi" resourceLabel="Instansi" columns={[
          { key: "id", label: "ID" },
          { key: "nama_instansi", label: "Nama Instansi" },
        ]} />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Penjual",
      //   path: "/penjual",
      //   element: <TablePage resourceKey="penjual" resourceLabel="Penjual" columns={[
      //     { key: "id", label: "ID" },
      //     { key: "nama", label: "Nama" },
      //     { key: "alamat", label: "Alamat" },
      //   ]} />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "PIB",
        path: "/pib",
        element: <TablePage resourceKey="pib" resourceLabel="PIB" columns={[
          { key: "id", label: "ID" },
          { key: "id_penjual", label: "ID Penjual" },
          { key: "id_importir", label: "ID Importir" },
          { key: "id_sarana_pengangkutan", label: "ID Sarana Pengangkutan" },
          { key: "tipe_pengangkutan", label: "Tipe Pengangkutan" },
          { key: "pelabuhan_muat", label: "Pelabuhan Muat" },
          { key: "pelabuhan_tujuan", label: "Pelabuhan Tujuan" },
          { key: "tanggal_berangkat", label: "Tanggal Berangkat" },
          { key: "ndpbm", label: "NDPBM" },
        ]} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Required Docs",
        path: "/required_docs",
        element: <TablePage resourceKey="required_docs" resourceLabel="Required Docs" columns={[
          { key: "id", label: "ID" },
          { key: "id_barang", label: "ID Barang" },
          { key: "tipe_dokumen", label: "Tipe Dokumen" },
        ]} />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Sarana Pengangkutan",
      //   path: "/sarana_pengangkutan",
      //   element: <TablePage resourceKey="sarana_pengangkutan" resourceLabel="Sarana Pengangkutan" columns={[
      //     { key: "id", label: "ID" },
      //     { key: "nama", label: "Nama" },
      //     { key: "nomor_identitas", label: "Nomor Identitas" },
      //     { key: "bendera", label: "Bendera" },
      //   ]} />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Import Barang",
        path: "/import-barang",
        element: <ImportBarang />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
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
