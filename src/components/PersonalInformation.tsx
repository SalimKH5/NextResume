"use client";
import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { PhoneInput } from "./phone-input";
import { useDragDrop } from "./DraggableContext";

const PersonalInformation = () => {
  const { information, setInformations } = useDragDrop();
  return (
    <div className={`w-full flex flex-col gap-6`}>
      <div key="input-title" className="flex flex-col gap-3">
        <span>Titre sur le CV</span>
        <Input
          type="text"
          value={information.title}
          onChange={(e) => {
            setInformations((prev) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
          placeholder="Titre sur le CV"
        />
      </div>
      <div key="input-Textarea" className="flex flex-col gap-3">
        <span>Votre accroche</span>
        <Textarea
          value={information.CatchPhrase}
          onChange={(e) => {
            setInformations((prev: InformationsType) => ({
              ...prev,
              CatchPhrase: e.target.value,
            }));
          }}
          placeholder="Type your message here."
          cols={30}
        />
      </div>
      <div key="input-Email" className="flex flex-col  gap-3">
        <span>Email</span>
        <div className="flex items-center  gap-2 flex-1">
          <Input
            value={information.email.label}
            onChange={(e) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                email: { ...prev.email, label: e.target.value },
              }));
            }}
            type="email"
            placeholder="Votre Email"
            className="flex-1"
          />
          <Switch
            id="email"
            checked={information.email.display}
            onCheckedChange={(checked) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                email: { ...prev.email, display: checked },
              }));
            }}
          />
        </div>
      </div>

      <div key="input-phoneNumber" className="flex flex-col  gap-3">
        <span>phoneNumber</span>
        <div className="flex items-center  gap-2 flex-1">
          <PhoneInput
            value={information.phonenumber.label}
            onChange={(value) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                phonenumber: { ...prev.phonenumber, label: value },
              }));
            }}
            defaultCountry="FR"
            className="flex-1"
          />
          <Switch
            id="phone"
            checked={information.phonenumber.display}
            onCheckedChange={(checked) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                phonenumber: { ...prev.phonenumber, display: checked },
              }));
            }}
          />
        </div>
      </div>
      <div key="input-Location" className="flex flex-col  gap-3">
        <span>Location</span>
        <div className="flex items-center  gap-2 flex-1">
          <Input
            type="text"
            value={information.locations.label}
            onChange={(e) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                locations: { ...prev.locations, label: e.target.value },
              }));
            }}
            placeholder="Votre ville"
            className="flex-1"
          />
          <Switch
            id="town"
            checked={information.locations.display}
            onCheckedChange={(checked) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                locations: { ...prev.locations, display: checked },
              }));
            }}
          />
        </div>
      </div>
      <div key="input-Picture" className="flex flex-col  gap-3">
        <span>Picture</span>
        <div className="flex items-center  gap-2">
          <p className=" flex-1">display picture</p>
          <Switch
            id="email"
            checked={information?.picture?.display}
            onCheckedChange={(checked) => {
              setInformations((prev: InformationsType) => ({
                ...prev,
                picture: {
                  display: checked,
                  label: prev?.picture?.label ?? "", // valeur par défaut si label est undefined
                },
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
