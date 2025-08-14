// global.d.ts

export {}; // this ensures this file is treated as a module

declare global {
  type Skills = {
    id:number;
    skill: string;
    subItems: string;
  };

  type Languge = {
    id:number;
    value: string;
    label: string;
    valuebar?:number;
  };

  type Experience = {
    id: number;
    title: string;
    date_started: string ;
    date_ending: string ;
    location: string;
    subItems: string;
    entrepriseName: string;

  };

  type Educations = {
    id: number;
    title: string;
    date_started: string ;
    date_ending: string ;
    school: string;
    location: string;
    subItems: string;
  };

  type DisplayComponent = {
    label: string;
    display: boolean;
  };

  type IntersetType={
       id:number;
    value?: string;
    label: string;
  }
  type InformationsType = {
    email: DisplayComponent;
    phonenumber: DisplayComponent;
    locations: DisplayComponent;
    birthday: Date;
    picture?:DisplayComponent;
    title: string;
    CatchPhrase: string;
    titleSkills?:string="Skills";
    titleExprience?:string="Work Experience";
    titleEducations?:string="Work Educations";
    titleLanguages?:string="Languages";
    skills?: Skills[];
    Languages?: Languge[];
    Expriences?: Experience[];
    Educations?: Educations[];
    Intersets?:IntersetType[];
  };


  type OptionsStyle={
    BackgroundColor?:string;
    primaryColor?:string,
    secondColor?:string,
    font?:string,
    textSize?:number,
    titleSize?:number,
    textSize?:number|string,
    fontweight?:number|string,
    paddingHorizontal?:number,
    paddingVertical?:number,
    maxContentWidth?:number,
    SpaceContent?:number,
    SpaceInside?:number;
    displayOneLine?:boolean=false;
    diplayDateLine?:boolean=false;
    diplayLanguageLine?:boolean=false;
  }


type Zone = {
  id: string;
};



type DroppedItem = {
  id: string;
  component: React.ReactNode;
};

// type DroppedItemsMap = {
//   [zoneId: string]: DroppedItem[];
// };

type DroppedItemsMap = {
  [zoneId: string]: {
    [page: number]: DroppedItem[];
  };
};

type TemplateComponentType = (props: { containerRef?: React.RefObject<HTMLDivElement> }) => JSX.Element;


declare namespace NodeJS {
  interface Global {
    _mongoClientPromise?: Promise<MongoClient>
  }
}

type UserType={
  id?:string,
  firstName?:string|null,
  lastName?:string|null,
  email?:string,
  gender?:string,
  dateOfbirth?:Date,
  PhoneNumber?:string,
  address?:string,
  postalCode?:string,
  town?:string,
  country?:string
}



}
