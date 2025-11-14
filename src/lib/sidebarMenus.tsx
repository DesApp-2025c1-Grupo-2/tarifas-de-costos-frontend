import {
  Building2,
  CalendarDays,
  ChartColumn,
  DollarSign,
  FileText,
  Fuel,
  Layers,
  Map,
  MapPin,
  Navigation,
  Package,
  Truck,
  User,
  Users,
  Warehouse,
} from "lucide-react";

export const sidebarMenus = {
  viajes: [
    {
      src: User,
      title: "Choferes",
      link: "https://gestion-de-viajes.vercel.app/drivers",
    },
    {
      src: Warehouse,
      title: "Depósitos",
      link: "https://gestion-de-viajes.vercel.app/depots",
    },
    {
      src: Building2,
      title: "Empresas",
      link: "https://gestion-de-viajes.vercel.app/companies",
    },
    {
      src: Truck,
      title: "Vehículos",
      link: "https://gestion-de-viajes.vercel.app/vehicles",
    },
    {
      src: Layers,
      title: "Tipos de Vehículos",
      link: "https://gestion-de-viajes.vercel.app/type-vehicle",
    },
    {
      src: Navigation,
      title: "Viajes",
      link: "https://gestion-de-viajes.vercel.app/trips/distribution",
    },
  ],
  remitos: [
    {
      src: CalendarDays,
      title: "Agenda",
      link: "https://remitos-front.netlify.app/agenda",
    },
    {
      src: Users,
      title: "Clientes",
      link: "https://remitos-front.netlify.app/clientes",
    },
    {
      src: MapPin,
      title: "Destinos",
      link: "https://remitos-front.netlify.app/destinos",
    },
    {
      src: FileText,
      title: "Remitos",
      link: "https://remitos-front.netlify.app/remitos",
    },
    {
      src: ChartColumn,
      title: "Reportes",
      link: "https://remitos-front.netlify.app/reportes",
    },
  ],
  costos: [
    { src: Layers, title: "Adicionales", link: "adicionales" },
    { src: Package, title: "Cargas", link: "tipos-de-carga" },
    { src: Fuel, title: "Combustible", link: "combustible" },
    { src: ChartColumn, title: "Reportes", link: "reportes" },
    { src: DollarSign, title: "Tarifas", link: "tarifas" },
    { src: Map, title: "Zonas", link: "zonas" },
  ],

  inicio: [],
};
