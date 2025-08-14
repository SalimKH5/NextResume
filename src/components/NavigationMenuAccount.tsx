import React from "react";
import { Button } from "./ui/button";

const NavigationMenuAccount = () => {
  return (
    <div className="flex items-center justify-center gap-3 border-b-2 py-2">
      <Button>Profil</Button>
      <Button>Notifications & Emails</Button>
      <Button>Projet</Button>
      <Button>Abonnements</Button>
      <Button>Facturation</Button>
    </div>
  );
};

export default NavigationMenuAccount;
