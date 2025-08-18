import { Calendar, LocationEdit, Mail, Phone } from "lucide-react";
import React from "react";
import { useDragDrop } from "./DraggableContext";

const PersonalInfoDetail = () => {
  const { information, fontOptions } = useDragDrop();

  return (
    <ul
      className={`w-full flex ${
        fontOptions.displayOneLine ? " items-center flex-wrap" : "flex-col"
      } gap-2`}
    >
      {information.email.display && (
        <li className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Mail size={16} color={fontOptions.primaryColor} />
          </div>
          <span className="break-words">{information.email.label}</span>
          {fontOptions.displayOneLine && "|"}
        </li>
      )}

      {information.locations.display && (
        <li className="flex items-center gap-3">
          <LocationEdit size={16} color={fontOptions.primaryColor} />
          <span>{information.locations.label}</span>
          {fontOptions.displayOneLine && "|"}
        </li>
      )}

      <li className="flex items-center gap-3">
        <Calendar size={16} color={fontOptions.primaryColor} />
        <span>
          {information.birthday instanceof Date
            ? information.birthday.toDateString()
            : new Date(information?.birthday).toDateString()}
        </span>
      </li>

      {information.phonenumber.display && (
        <li className="flex items-center gap-3">
          <Phone size={16} color={fontOptions.primaryColor} />
          <span>{information.phonenumber.label}</span>
          {fontOptions.displayOneLine && "|"}
        </li>
      )}
    </ul>
  );
};

export default PersonalInfoDetail;
