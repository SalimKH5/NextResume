"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import Educations from "./Educations";
import Expriences from "./Expriences";
import Languages from "./Languges";
import Skills from "./Skills";
import IntersetComponent from "./IntersetComponent";
import TemplatesOne from "./pages/TemplatesOne";
import { useSession } from "next-auth/react";

type DragDropContextType = {
  droppedItems: DroppedItemsMap;

  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDragStartZone: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragOverZone: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, zoneId: string,page: number) => void;
  handleDropZone: (e: React.DragEvent, targetIndex: number,page: number) => void;
  removeDroppedItem: (zoneId: string,page: number, id: string) => void;
  registerComponent: (id: string, component: React.ReactNode) => void;
  isItemDropped: (id: string) => boolean;
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItemsMap>>;
  information: InformationsType;
  setInformations: React.Dispatch<React.SetStateAction<InformationsType>>;
  fontOptions: OptionsStyle;
  setFontOptions: React.Dispatch<React.SetStateAction<OptionsStyle>>;
  SelectedTemplate: TemplateComponentType;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateComponentType>>;
  containerRef: React.RefObject<HTMLDivElement>;
  maxPages:number,
  setMaxPages:React.Dispatch<React.SetStateAction<number>>;
  checkItemsInPage:(page:number)=>boolean;
};

const DragDropContext = createContext<DragDropContextType | undefined>(
  undefined
);

export const DragDropProvider = ({ children }: { children: ReactNode }) => {
  const [droppedItems, setDroppedItems] = useState<DroppedItemsMap>({
    "zone-B": {
      1: [
        {
          id: "education-1",
          component: <Educations />,
        },
         {
          id: "WorkExpricence",
          component: <Expriences />,
        },
      ],
    },
    "zone-A": {
      1: [
        {
          id: "Languges-1",
          component: <Languages />,
        },
        {
          id: "Skills-2",
          component: <Skills />,
        },
        {
          id: "Interst-2",
          component: <IntersetComponent />,
        },
      ],
      
    },
  });
const { data: session, update ,status} = useSession();
  const [maxPages, setMaxPages] = useState<number>(1);

  const [SelectedTemplate, setSelectedTemplate] =
    useState<TemplateComponentType>(() => TemplatesOne);

  const [fontOptions, setFontOptions] = useState<OptionsStyle>({
    BackgroundColor: "#333333",
    primaryColor: "#FFFFFF",
    secondColor: "#479099",
    font: "Arial, sans-serif",
    textSize: 14,
    titleSize: 20,
    fontweight: 700,
    paddingHorizontal: 3,
    paddingVertical: 5,
    maxContentWidth: 10,
    SpaceContent: 20,
    SpaceInside: 10,
  });
  const componentRegistry = useRef<Map<string, React.ReactNode>>(new Map());

  const [information, setInformations] = useState<InformationsType>({
    email: { label: session?.user?.email??"", display: true },
    birthday: new Date("1995-01-01"),
    locations: { label: "Lyon, France", display: true },
    phonenumber: { label: "+33000000000", display: true },
    picture: { label: "default-profile.jpg", display: true },
    titleSkills:"Skills",
    titleExprience:"Work Experience",
    titleEducations:"Work Educations",
    titleLanguages:"Languages",
    CatchPhrase:
      "Développeur web polyvalent avec une forte appétence pour les technologies modernes, toujours en quête de nouveaux défis pour concevoir des solutions innovantes et efficaces.",
    title: "Développeur Full Stack | React.js & Node.js",
    skills: [
      {
        id: 1,
        skill: "Frontend",
        subItems: "React.js, Next.js, Tailwind CSS, TypeScript",
      },
      {
        id: 2,
        skill: "Backend",
        subItems: "Node.js, Express.js, MongoDB, PostgreSQL",
      },
      {
        id: 3,
        skill: "Outils & Méthodologies",
        subItems: "Git, Docker, CI/CD, Agile/Scrum",
      },
    ],
    Languages: [
      {
        id: 1,
        label: "Français",
        value: "Langue maternelle",
      },
      {
        id: 2,
        label: "Anglais",
        value: "Intermédiaire",
     
      },
      {
        id: 3,
        label: "Espagnol",
        value: "Notions de base",
       
      },
    ],
    Expriences: [
      {
        id: 1,
        entrepriseName: "Tech Solutions",
        date_started: "2022-09",
        date_ending: "2023-06",
        location: "Paris, France",
        title: "Développeur Full Stack",
        subItems: `
        <ul>
          <li>Développement d'applications web avec React et Node.js</li>
          <li>Conception d'APIs REST et intégration de bases de données</li>
          <li>Participation à des sprints Agile et revues de code</li>
        </ul>
      `,
      },
      {
        id: 2,
        entrepriseName: "Tech Solutions",
        date_started: "2022-09",
        date_ending: "2023-06",
        location: "Paris, France",
        title: "Développeur Full Stack",
        subItems: `
        <ul>
          <li>Développement d'applications web avec React et Node.js</li>
          <li>Conception d'APIs REST et intégration de bases de données</li>
          <li>Participation à des sprints Agile et revues de code</li>
        </ul>
      `,
      },

      
    ],
    Educations: [
      {
        id: 1,
        title: "Master Développement Logiciel",
        date_started: "2023-09",
        date_ending: "2025-06",
        school: "Université de Technologie",
        location: "Toulouse, France",
        subItems: `
        <ul>
          <li>Programmation avancée et architecture logicielle</li>
          <li>Projets de développement Agile en groupe</li>
          <li>Spécialisation en web et cloud computing</li>
        </ul>
      `,
      },
      {
        id: 2,
        title: "Licence Informatique",
        date_started: "2020-09",
        date_ending: "2023-06",
        school: "Faculté des Sciences",
        location: "Strasbourg, France",
        subItems: `
        <ul>
          <li>Base en algorithmique, systèmes et développement web</li>
          <li>Travaux pratiques en Java, Python et SQL</li>
          <li>Projets tutorés sur des applications web</li>
        </ul>
      `,
      },
    ],
    Intersets: [
      { id: 1, label: "Jeux vidéo,Lecture ,Modélisation 3D" },

    ],
  });

  const checkItemsInPage=(pageNumber:number)=>{
  const pageKey = String(pageNumber);
  return Object.values(droppedItems).some(zone => zone.hasOwnProperty(pageKey));
  }

  console.log({session})
  useEffect(()=>{
      if(status=="authenticated"){
        setInformations((prev)=>({
          ...prev,
          email:{...prev.email,label:session!.user.email!}
        }))
       
      }
  },[status]);


  const containerRef = useRef<HTMLDivElement>(null!);

  const [zones, setZones] = useState<Zone[]>([{ id: "zone-1" }]);

  const registerComponent = useCallback(
    (id: string, component: React.ReactNode) => {
      componentRegistry.current.set(id, component);
    },
    []
  );

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
const handleDrop = useCallback(
  (e: React.DragEvent, zoneId: string, page: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const component = componentRegistry.current.get(id);
    if (!component) return;

    setDroppedItems((prev) => {
      const zonePages = prev[zoneId] || {};
      const existing = zonePages[page] || [];

      // Empêcher les doublons
      if (existing.some((item) => item.id === id)) return prev;

      return {
        ...prev,
        [zoneId]: {
          ...zonePages,
          [page]: [...existing, { id, component }],
        },
      };
    });
  },
  []
);

const removeDroppedItem = useCallback(
  (zoneId: string, page: number, id: string) => {
    setDroppedItems((prev) => {
      const zonePages = prev[zoneId] || {};
      const pageItems = zonePages[page] || [];

      return {
        ...prev,
        [zoneId]: {
          ...zonePages,
          [page]: pageItems.filter((item) => item.id !== id),
        },
      };
    });
  },
  []
);

const isItemDropped = useCallback(
  (id: string) => {
    return Object.values(droppedItems).some((zonePages) =>
      Object.values(zonePages).some((items) =>
        items.some((item) => item.id === id)
      )
    );
  },
  [droppedItems]
);

const handleDragStartZone = useCallback(
  (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("zone-index", index.toString());
  },
  []
);

const handleDropZone = useCallback(
  (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("zone-index"), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    setZones((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  },
  []
);

const handleDragOverZone = useCallback((e: React.DragEvent) => {
  e.preventDefault();
}, []);





  return (
    <DragDropContext.Provider
      value={{
        droppedItems,
        handleDragStart,
        handleDragOver,
        handleDrop,
        removeDroppedItem,
        registerComponent,
        isItemDropped,
        zones,
        setZones,
        handleDragStartZone,
        setDroppedItems,
        handleDropZone,
        handleDragOverZone,
        information,
        setInformations,
        fontOptions,
        setFontOptions,
        SelectedTemplate,
        setSelectedTemplate,
        containerRef,
        maxPages,
        setMaxPages,
        checkItemsInPage
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = (): DragDropContextType => {
  const context = useContext(DragDropContext);
  if (!context)
    throw new Error("useDragDrop must be used inside a DragDropProvider");
  return context;
};
