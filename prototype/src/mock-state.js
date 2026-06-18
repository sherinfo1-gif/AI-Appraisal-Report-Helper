window.MockState = {
  session: {
    currentScreen: "dashboard",
    currentStep: "create-case",
    activeCaseId: null,
    currentUserId: "user-appraiser-1"
  },

  users: [
    {
      id: "user-appraiser-1",
      name: "Aziz Karimov",
      role: "appraiser"
    },
    {
      id: "user-reviewer-1",
      name: "Dilnoza Saidova",
      role: "reviewer"
    }
  ],

  happyPathSteps: [
    {
      id: "create-case",
      title: "Создание кейса",
      status: "active"
    },
    {
      id: "basic-data",
      title: "Заполнение данных",
      status: "locked"
    },
    {
      id: "ai-proposals",
      title: "Предложения ИИ",
      status: "locked"
    },
    {
      id: "appraiser-approval",
      title: "Утверждение оценщиком",
      status: "locked"
    },
    {
      id: "review-submission",
      title: "Отправка на ревью",
      status: "locked"
    }
  ],

  cases: [
    {
      id: "case-demo-001",
      code: "APT-DEMO-001",
      status: "draft",
      currentStep: "basic-data",

      createdAt: "2026-06-18T09:00:00+05:00",
      createdBy: "user-appraiser-1",

      assignment: {
        direction: "real-estate",
        objectType: "apartment",
        purpose: "collateral",
        valuationDate: "2026-06-18",
        deadline: "2026-06-25",
        appraiserId: "user-appraiser-1",
        reviewerId: "user-reviewer-1"
      },

      customer: {
        name: "Demo Bank Client",
        contactPerson: "Demo Contact",
        phone: "+998 00 000 00 00"
      },

      subject: {
        address: "Tashkent, Demo district, Demo street 12",
        cadastralNumber: "DEMO-00-00-0000",
        propertyRights: "Ownership",
        areaSqm: 72.4,
        rooms: 3,
        floor: 5,
        buildingFloors: 9,
        condition: "Good"
      },

      documents: [
        {
          id: "doc-demo-cadastral",
          title: "Demo cadastral extract",
          type: "cadastral",
          status: "available"
        },
        {
          id: "doc-demo-inspection",
          title: "Demo inspection notes",
          type: "inspection",
          status: "available"
        }
      ],

      aiProposals: [
        {
          id: "ai-proposal-object-description",
          sectionId: "object-description",
          title: "Описание объекта",
          status: "pending",
          confidence: "medium",
          sourceDocumentIds: [
            "doc-demo-cadastral",
            "doc-demo-inspection"
          ],
          proposedText:
            "Объект оценки представляет собой демонстрационную трехкомнатную квартиру, расположенную по адресу: Tashkent, Demo district, Demo street 12.",
          appraiserDecision: null,
          appraiserComment: ""
        },
        {
          id: "ai-proposal-purpose",
          sectionId: "valuation-purpose",
          title: "Цель оценки",
          status: "pending",
          confidence: "high",
          sourceDocumentIds: [
            "doc-demo-cadastral"
          ],
          proposedText:
            "Оценка выполняется для целей залогового обеспечения в рамках демонстрационного сценария.",
          appraiserDecision: null,
          appraiserComment: ""
        }
      ],

      reportSections: [
        {
          id: "object-description",
          title: "Описание объекта",
          status: "ai-proposed",
          activeText: "",
          versions: []
        },
        {
          id: "valuation-purpose",
          title: "Цель и основание оценки",
          status: "ai-proposed",
          activeText: "",
          versions: []
        }
      ],

      appraiserApproval: {
        approvedAt: null,
        approvedBy: null,
        approvedProposalIds: [],
        editedSectionIds: []
      },

      review: {
        status: "not-submitted",
        submittedAt: null,
        submittedBy: null,
        reviewerId: "user-reviewer-1",
        comments: []
      },

      auditTrail: [
        {
          id: "audit-001",
          at: "2026-06-18T09:00:00+05:00",
          actorId: "user-appraiser-1",
          action: "case_created",
          note: "Demo case created in frontend prototype."
        }
      ]
    }
  ],

  draftCase: {
    assignment: {},
    customer: {},
    subject: {}
  }
};
