import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login"); // Redirige vers la page de login par défaut
}