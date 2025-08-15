"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { PhoneInput } from "@/components/phone-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";






export default function ProfilePage() {
  const { data: session, update ,status} = useSession();
  const user = session?.user;

  const [form, setForm] = useState<UserType>({
    firstName: user?.firstName,
    lastName: user?.lastName ,
    gender: user?.gender ,
    dateOfbirth: user?.dateOfbirth?.toString() ,
    PhoneNumber: user?.PhoneNumber ,
    email: user?.email,
    address: user?.address ,
    postalCode: user?.postalCode ,
    town: user?.town ,
    country: user?.country,
  });


  useEffect(()=>{
    if(status==="authenticated"){
           setForm(session?.user);
    }
   
  },[session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev:UserType) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      // Option 1: Refresh session to get updated user data
      await update();

      // Option 2: Or force signIn again with updated info to update token (if needed)
      // await signIn("credentials", { email: form.email }, { redirect: false });

      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile");
    }
  };
console.log({session});
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-6"
    >
      <h1>Informations personnelles</h1>
      <div className="grid grid-cols-2 gap-9">
        <div className="flex flex-col gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={form.firstName!}
            onChange={handleChange}
            className="max-w-xs"
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            value={form.lastName!}
            onChange={handleChange}
            className="max-w-xs"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Gender</Label>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="gender-female"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              className="h-3 w-3"
            />
            <label htmlFor="gender-female">Women</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="gender-male"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              className="h-3 w-3"
            />
            <label htmlFor="gender-male">Men</label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfbirth"
            name="dateOfbirth"
            type="date"
            value={form.dateOfbirth as string}
            onChange={handleChange}
            className="max-w-xs"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <Label>Numéro de téléphone (optionnel)</Label>
          <PhoneInput
            name="phoneNumber"
            value={form.PhoneNumber}
            onChange={(value) => setForm((prev:UserType) => ({ ...prev, phoneNumber: value }))}
            className="max-w-xs"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="py-6 disabled:bg-gray-200"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <Label htmlFor="address">Adresse (optionnel)</Label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
            className="py-6"
          />
        </div>

        <div className="col-span-2 grid md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-3">
            <Label htmlFor="postalCode">Code postal (optionnel)</Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="Enter your postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="py-6"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="town">Ville (optionnel)</Label>
            <Input
              id="town"
              name="town"
              type="text"
              placeholder="Enter your town"
              value={form.town}
              onChange={handleChange}
              className="py-6"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="country">Pays (optionnel)</Label>
            <Input
              id="country"
              name="country"
              type="text"
              placeholder="Enter your country"
              value={form.country}
              onChange={handleChange}
              className="py-6"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 px-6 py-3 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Enregistrer les modifications
      </Button>
    </form>
  );
}
