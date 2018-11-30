// comments:
// starting from CTP config but changing a few things.
// Especially, looking at "*Time" tags, while time alone may not be critical,
// we could develop a more consistent approach.

var instanceUIDs = [
    "InstanceCreatorUID",
    "SOPInstanceUID",
    "FailedSOPInstanceUIDList",
    "PrivateCodingSchemeCreatorUID",
    "CodeSetExtensionCreatorUID",
    "RefSOPInstanceUID",
    "TransactionUID",
    "IrradiationEventUID",
    "CreatorVersionUID",
    "DeviceUID",
    "StudyInstanceUID",
    "SeriesInstanceUID",
    "FrameOfReferenceUID",
    "SynchronizationFrameOfReferenceUID",
    "ConcatenationUID",
    "DimensionOrganizationUID",
    "PaletteColorLUTUID",
    "LargePaletteColorLUTUid",
    "RefGenPurposeSchedProcStepTransUID",
    "UID",
    "TemplateExtensionOrganizationUID",
    "TemplateExtensionCreatorUID",
    "FiducialUID",
    "StorageMediaFilesetUID",
    "DigitalSignatureUID",
    "ReferencedFrameOfReferenceUID",
    "RelatedFrameOfReferenceUID",
    "DoseReferenceUID",
    "MediaStorageSOPInstanceUID"
];

var tagNamesToEmpty = [
    // please override these in specificReplaceDefaults to have useful values
    "PatientID",
    "PatientName",

    // 0/3: those that appear missing in CTP
    "SeriesDate",
    "AccessionNumber",
    // (valuable, but sometimes manually filled)
    "SeriesDescription",
    // cat 1/3: CTP: set to empty explicitely using @empty
    "StudyTime",
    "ContentTime",
    "ReferringPhysicianName",
    "PatientBirthDate",
    "PatientSex",
    "ClinicalTrialSiteID",
    "ClinicalTrialSiteName",
    "ClinicalTrialSubjectID",
    "ClinicalTrialSubjectReadingID",
    "ClinicalTrialTimePointID",
    "ClinicalTrialTimePointDescription",
    "ContrastBolusAgent",
    "StudyID",
    // cat 2/3: CTP: set to increment dates
    "InstanceCreationDate",
    "StudyDate",
    "ContentDate",
    "DateOfSecondaryCapture",
    "DateOfLastCalibration",
    "DateOfLastDetectorCalibration",
    "FrameAcquisitionDatetime",
    "FrameReferenceDatetime",
    "StudyVerifiedDate",
    "StudyReadDate",
    "ScheduledStudyStartDate",
    "ScheduledStudyStopDate",
    "StudyArrivalDate",
    "StudyCompletionDate",
    "ScheduledAdmissionDate",
    "ScheduledDischargeDate",
    "DischargeDate",
    "SPSStartDate",
    "SPSEndDate",
    "PPSStartDate",
    "PPSEndDate",
    "IssueDateOfImagingServiceRequest",
    "VerificationDateTime",
    "ObservationDateTime",
    "DateTime",
    "Date",
    "RefDatetime",
    // cat 3/3: CTP: set to remove using @remove
    "AcquisitionDate",
    "OverlayDate",
    "CurveDate",
    "AcquisitionDatetime",
    "SeriesTime",
    "AcquisitionTime",
    "OverlayTime",
    "CurveTime",
    "InstitutionName",
    "InstitutionAddress",
    "ReferringPhysicianAddress",
    "ReferringPhysicianPhoneNumbers",
    "ReferringPhysiciansIDSeq",
    "TimezoneOffsetFromUTC",
    "StationName",
    "StudyDescription",
    "InstitutionalDepartmentName",
    "PhysicianOfRecord",
    "PhysicianOfRecordIdSeq",
    "PerformingPhysicianName",
    "PerformingPhysicianIdSeq",
    "NameOfPhysicianReadingStudy",
    "PhysicianReadingStudyIdSeq",
    "OperatorName",
    "OperatorsIdentificationSeq",
    "AdmittingDiagnosisDescription",
    "AdmittingDiagnosisCodeSeq",
    "RefStudySeq",
    "RefPPSSeq",
    "RefPatientSeq",
    "RefImageSeq",
    "DerivationDescription",
    "SourceImageSeq",
    "IdentifyingComments",
    "IssuerOfPatientID",
    "PatientBirthTime",
    "PatientInsurancePlanCodeSeq",
    "PatientPrimaryLanguageCodeSeq",
    "PatientPrimaryLanguageModifierCodeSeq",
    "OtherPatientIDs",
    "OtherPatientNames",
    "OtherPatientIDsSeq",
    "PatientBirthName",
    "PatientAge",
    "PatientSize",
    "PatientWeight",
    "PatientAddress",
    "InsurancePlanIdentification",
    "PatientMotherBirthName",
    "MilitaryRank",
    "BranchOfService",
    "MedicalRecordLocator",
    "MedicalAlerts",
    "ContrastAllergies",
    "CountryOfResidence",
    "RegionOfResidence",
    "PatientPhoneNumbers",
    "EthnicGroup",
    "Occupation",
    "SmokingStatus",
    "AdditionalPatientHistory",
    "PregnancyStatus",
    "LastMenstrualDate",
    "PatientReligiousPreference",
    "PatientSexNeutered",
    "ResponsiblePerson",
    "ResponsibleOrganization",
    "PatientComments",
    "DeviceSerialNumber",
    "PlateID",
    "GeneratorID",
    "CassetteID",
    "GantryID",
    // we keep - should be SoftwareVersions anyway
    // "SoftwareVersion",
    "ProtocolName",
    "AcquisitionDeviceProcessingDescription",
    "AcquisitionComments",
    "DetectorID",
    "AcquisitionProtocolDescription",
    "ContributionDescription",
    "ModifyingDeviceID",
    "ModifyingDeviceManufacturer",
    "ModifiedImageDescription",
    "ImageComments",
    "ImagePresentationComments",
    "StudyIDIssuer",
    "ScheduledStudyLocation",
    "ScheduledStudyLocationAET",
    "ReasonforStudy",
    "RequestingPhysician",
    "RequestingService",
    "RequestedProcedureDescription",
    "RequestedContrastAgent",
    "StudyComments",
    "AdmissionID",
    "IssuerOfAdmissionID",
    "ScheduledPatientInstitutionResidence",
    "AdmittingDate",
    "AdmittingTime",
    "DischargeDiagnosisDescription",
    "SpecialNeeds",
    "ServiceEpisodeID",
    "IssuerOfServiceEpisodeId",
    "ServiceEpisodeDescription",
    "CurrentPatientLocation",
    "PatientInstitutionResidence",
    "PatientState",
    "ReferencedPatientAliasSeq",
    "VisitComments",
    "ScheduledStationAET",
    "ScheduledPerformingPhysicianName",
    "SPSDescription",
    "ScheduledStationName",
    "SPSLocation",
    "PreMedication",
    "PerformedStationAET",
    "PerformedStationName",
    "PerformedLocation",
    "PerformedStationNameCodeSeq",
    "PPSID",
    "PPSDescription",
    "RequestAttributesSeq",
    "PPSComments",
    "AcquisitionContextSeq",
    "PatientTransportArrangements",
    "RequestedProcedureLocation",
    "NamesOfIntendedRecipientsOfResults",
    "IntendedRecipientsOfResultsIDSequence",
    "PersonAddress",
    "PersonTelephoneNumbers",
    "RequestedProcedureComments",
    "ReasonForTheImagingServiceRequest",
    "OrderEnteredBy",
    "OrderEntererLocation",
    "OrderCallbackPhoneNumber",
    "ImagingServiceRequestComments",
    "ConfidentialityPatientData",
    "ScheduledStationNameCodeSeq",
    "ScheduledStationGeographicLocCodeSeq",
    "PerformedStationGeoLocCodeSeq",
    "ScheduledHumanPerformersSeq",
    "ActualHumanPerformersSequence",
    "HumanPerformersOrganization",
    "HumanPerformersName",
    "VerifyingOrganization",
    "VerifyingObserverName",
    "AuthorObserverSequence",
    "ParticipantSequence",
    "CustodialOrganizationSeq",
    "VerifyingObserverIdentificationCodeSeq",
    "PersonName",
    "ContentSeq",
    "OverlayData",
    "OverlayComments",
    "IconImageSequence",
    "TopicSubject",
    "TopicAuthor",
    "TopicKeyWords",
    "TextString",
    "Arbitrary",
    "TextComments",
    "ResultsIDIssuer",
    "InterpretationRecorder",
    "InterpretationTranscriber",
    "InterpretationText",
    "InterpretationAuthor",
    "InterpretationApproverSequence",
    "PhysicianApprovingInterpretation",
    "InterpretationDiagnosisDescription",
    "ResultsDistributionListSeq",
    "DistributionName",
    "DistributionAddress",
    "InterpretationIdIssuer",
    "Impressions",
    "ResultComments",
    "DigitalSignaturesSeq",
    "DataSetTrailingPadding"
];

// list of safe tags (CTP: listed with just empty replacement value)
var tagNamesToAlwaysKeep = [
    //  the first here are specific to this tools workings
    "Item",
    "ItemDelimitationItem",
    "SequenceDelimitationItem",
    "GenericGroupLength",
    "PatientIdentityRemoved",
    "DeIdentificationMethod",
    "PixelData",
    "SoftwareVersions",
    "ImagePositionPatient",
    "ImageOrientationPatient",
    // the following are annotated as REQUIRE in ctp
    "Modality",
    "BodyPartExamined",
    // the following are annotated as KEEP in ctp
    "SpecificCharacterSet",
    "SOPClassUID",
    // "SeriesDate",
    "Manufacturer",
    "ManufacturerModelName",
    "RefSOPClassUID",
    // the following are just listed in CTP
    "ImageType",
    // "InstanceCreationTime",
    "QueryRetrieveLevel",
    "RetrieveAET",
    "InstanceAvailability",
    "ModalitiesInStudy",
    "ConversionType",
    "PresentationIntentType",
    "InstitutionCodeSeq",
    "CodeValue",
    "CodingSchemeDesignator",
    "CodingSchemeVersion",
    "CodeMeaning",
    "MappingResource",
    "ContextGroupVersion",
    "ContextGroupLocalVersion",
    "CodeSetExtensionFlag",
    "ContextIdentifier",
    "ProcedureCodeSeq",
    "RefResultsSeq",
    "RefSeriesSeq",
    "RefVisitSeq",
    "RefOverlaySeq",
    "RefCurveSeq",
    "RefInstanceSeq",
    "SOPClassesSupported",
    "RefFrameNumber",
    "FailureReason",
    "FailedSOPSeq",
    "RefSOPSeq",
    "StageName",
    "StageNumber",
    "NumberOfStages",
    "ViewNumber",
    "NumberOfEventTimers",
    "NumberOfViewsInStage",
    "EventElapsedTime",
    "EventTimerName",
    "StartTrim",
    "StopTrim",
    "RecommendedDisplayFrameRate",
    "AnatomicRegionSeq",
    "AnatomicRegionModifierSeq",
    "PrimaryAnatomicStructureSeq",
    "AnatomicStructureSpaceRegionSeq",
    "PrimaryAnatomicStructureModifierSeq",
    "TransducerPositionSeq",
    "TransducerPositionModifierSeq",
    "TransducerOrientationSeq",
    "TransducerOrientationModifierSeq",
    "FrameType",
    "ReferringImageEvidenceSeq",
    "RefRawDataSeq",
    "DerivationImageSeq",
    "SourceImageEvidenceSeq",
    "PixelPresentation",
    "VolumetricProperties",
    "VolumeBasedCalculationTechnique",
    "ComplexImageComponent",
    "AcquisitionContrast",
    "DerivationCodeSeq",
    "RefGrayscalePresentationStateSeq",
    "ClinicalTrialProtocolName",
    "CoordinatingCenterName",
    "DeIdentificationMethodCodeSeq",
    "ContrastBolusAgentSeq",
    "ContrastBolusAdministrationRouteSeq",
    // replacing CTP tags - probable spelling issue
    "ScanningSequence",
    "SequenceVariant",
    // "ScanningSeq",
    // "SeqVariant",
    "ScanOptions",
    "MRAcquisitionType",
    "SequenceName",
    "AngioFlag",
    "InterventionDrugInformationSeq",
    "InterventionDrugStopTime",
    "InterventionDrugDose",
    "InterventionDrugCodeSeq",
    "AdditionalDrugSeq",
    "Radiopharmaceutical",
    "InterventionDrugName",
    "InterventionDrugStartTime",
    "InterventionalTherapySeq",
    "TherapyType",
    "InterventionalStatus",
    "TherapyDescription",
    "CineRate",
    "SliceThickness",
    "KVP",
    "CountsAccumulated",
    "AcquisitionTerminationCondition",
    "EffectiveSeriesDuration",
    "AcquisitionStartCondition",
    "AcquisitionStartConditionData",
    "AcquisitionTerminationConditionData",
    "RepetitionTime",
    "EchoTime",
    "InversionTime",
    "NumberOfAverages",
    "ImagingFrequency",
    "ImagedNucleus",
    "EchoNumbers",
    // "EchoNumber",
    "MagneticFieldStrength",
    "SpacingBetweenSlices",
    "NumberOfPhaseEncodingSteps",
    "DataCollectionDiameter",
    "EchoTrainLength",
    "PercentSampling",
    "PercentPhaseFieldOfView",
    "PixelBandwidth",
    "SecondaryCaptureDeviceID",
    "HardcopyCreationDeviceID",
    "TimeOfSecondaryCapture",
    "SecondaryCaptureDeviceManufacturer",
    "HardcopyDeviceManufacturer",
    "SecondaryCaptureDeviceManufacturerModelName",
    "SecondaryCaptureDeviceSoftwareVersion",
    "HardcopyDeviceSoftwareVersion",
    "HardcopyDeviceManfuacturerModelName",
    "VideoImageFormatAcquired",
    "DigitalImageFormatAcquired",
    "ContrastBolusRoute",
    "ContrastBolusVolume",
    "ContrastBolusStartTime",
    "ContrastBolusStopTime",
    "ContrastBolusTotalDose",
    "SyringeCounts",
    "ContrastFlowRate",
    "ContrastFlowDuration",
    "ContrastBolusIngredient",
    "ContrastBolusIngredientConcentration",
    "SpatialResolution",
    "TriggerTime",
    "TriggerSourceOrType",
    "NominalInterval",
    "FrameTime",
    "FramingType",
    "FrameTimeVector",
    "FrameDelay",
    "ImageTriggerDelay",
    "MultiplexGroupTimeOffset",
    "TriggerTimeOffset",
    "SynchronizationTrigger",
    "SynchronizationChannel",
    "TriggerSamplePosition",
    "RadiopharmaceuticalRoute",
    "RadiopharmaceuticalVolume",
    "RadiopharmaceuticalStartTime",
    "RadiopharmaceuticalStopTime",
    "RadionuclideTotalDose",
    "RadionuclideHalfLife",
    "RadionuclidePositronFraction",
    "RadiopharmaceuticalSpecificActivity",
    "BeatRejectionFlag",
    "LowRRValue",
    "HighRRValue",
    "IntervalsAcquired",
    "IntervalsRejected",
    "PVCRejection",
    "SkipBeats",
    "HeartRate",
    "CardiacNumberOfImages",
    "TriggerWindow",
    "ReconstructionDiameter",
    "DistanceSourceToDetector",
    "DistanceSourceToPatient",
    "EstimatedRadiographicMagnificationFactor",
    "GantryDetectorTilt",
    "GantryDetectorSlew",
    "TableHeight",
    "TableTraverse",
    "TableMotion",
    "TableVerticalIncrement",
    "TableLateralIncrement",
    "TableLongitudinalIncrement",
    "TableAngle",
    "TableType",
    "RotationDirection",
    "AngularPosition",
    "RadialPosition",
    "ScanArc",
    "AngularStep",
    "CenterOfRotationOffset",
    "FieldOfViewShape",
    "FieldOfViewDimension",
    "ExposureTime",
    "XRayTubeCurrent",
    "Exposure",
    "ExposureInuAs",
    "AveragePulseWidth",
    "RadiationSetting",
    "RectificationType",
    "RadiationMode",
    "ImageAreaDoseProduct",
    "FilterType",
    "TypeOfFilters",
    "IntensifierSize",
    "ImagerPixelSpacing",
    "Grid",
    "GeneratorPower",
    "CollimatorGridName",
    "CollimatorType",
    "FocalDistance",
    "XFocusCenter",
    "YFocusCenter",
    "FocalSpot",
    "AnodeTargetMaterial",
    "BodyPartThickness",
    "CompressionForce",
    "TimeOfLastCalibration",
    "ConvolutionKernel",
    "ActualFrameDuration",
    "CountRate",
    "PreferredPlaybackSequencing",
    "ReceiveCoilName",
    "TransmitCoilName",
    "PlateType",
    "PhosphorType",
    "ScanVelocity",
    "WholeBodyTechnique",
    "ScanLength",
    "AcquisitionMatrix",
    "PhaseEncodingDirection",
    "FlipAngle",
    "VariableFlipAngleFlag",
    "SAR",
    "dBDt",
    "AcquisitionDeviceProcessingCode",
    "CassetteOrientation",
    "CassetteSize",
    "ExposuresOnPlate",
    "RelativeXRayExposure",
    "ColumnAngulation",
    "TomoLayerHeight",
    "TomoAngle",
    "TomoTime",
    "TomoType",
    "TomoClass",
    "NumberofTomosynthesisSourceImages",
    "PositionerMotion",
    "PositionerType",
    "PositionerPrimaryAngle",
    "PositionerSecondaryAngle",
    "PositionerPrimaryAngleIncrement",
    "PositionerSecondaryAngleIncrement",
    "DetectorPrimaryAngle",
    "DetectorSecondaryAngle",
    "ShutterShape",
    "ShutterLeftVerticalEdge",
    "ShutterRightVerticalEdge",
    "ShutterUpperHorizontalEdge",
    "ShutterLowerHorizontalEdge",
    "CenterOfCircularShutter",
    "RadiusOfCircularShutter",
    "VerticesOfPolygonalShutter",
    "ShutterPresentationValue",
    "ShutterOverlayGroup",
    "CollimatorShape",
    "CollimatorLeftVerticalEdge",
    "CollimatorRightVerticalEdge",
    "CollimatorUpperHorizontalEdge",
    "CollimatorLowerHorizontalEdge",
    "CenterOfCircularCollimator",
    "RadiusOfCircularCollimator",
    "VerticesOfPolygonalCollimator",
    "AcquisitionTimeSynchronized",
    "TimeSource",
    "TimeDistributionProtocol",
    "OutputPower",
    "TransducerData",
    "FocusDepth",
    "ProcessingFunction",
    "PostprocessingFunction",
    "MechanicalIndex",
    "ThermalIndex",
    "CranialThermalIndex",
    "SoftTissueThermalIndex",
    "SoftTissueFocusThermalIndex",
    "SoftTissueSurfaceThermalIndex",
    "DepthOfScanField",
    "PatientPosition",
    "ViewPosition",
    "ProjectionEponymousNameCodeSeq",
    "ImageTransformationMatrix",
    "ImageTranslationVector",
    "Sensitivity",
    "SeqOfUltrasoundRegions",
    "RegionSpatialFormat",
    "RegionDataType",
    "RegionFlags",
    "RegionLocationMinX0",
    "RegionLocationMinY0",
    "RegionLocationMaxX1",
    "RegionLocationMaxY1",
    "ReferencePixelX0",
    "ReferencePixelY0",
    "PhysicalUnitsXDirection",
    "PhysicalUnitsYDirection",
    "ReferencePixelPhysicalValueX",
    "ReferencePixelPhysicalValueY",
    "PhysicalDeltaX",
    "PhysicalDeltaY",
    "TransducerFrequency",
    "TransducerType",
    "PulseRepetitionFrequency",
    "DopplerCorrectionAngle",
    "SteeringAngle",
    "DopplerSampleVolumeXPosition",
    "DopplerSampleVolumeYPosition",
    "TMLinePositionX0",
    "TMLinePositionY0",
    "TMLinePositionX1",
    "TMLinePositionY1",
    "PixelComponentOrganization",
    "PixelComponentMask",
    "PixelComponentRangeStart",
    "PixelComponentRangeStop",
    "PixelComponentPhysicalUnits",
    "PixelComponentDataType",
    "NumberOfTableBreakPoints",
    "TableOfXBreakPoints",
    "TableOfYBreakPoints",
    "NumberOfTableEntries",
    "TableOfPixelValues",
    "TableOfParameterValues",
    "DetectorConditionsNominalFlag",
    "DetectorTemperature",
    "DetectorType",
    "DetectorConfiguration",
    "DetectorDescription",
    "DetectorMode",
    "TimeOfLastDetectorCalibration",
    "ExposuresOnDetectorSinceLastCalibration",
    "ExposuresOnDetectorSinceManufactured",
    "DetectorTimeSinceLastExposure",
    "DetectorActiveTime",
    "DetectorActivationOffsetFromExposure",
    "DetectorBinning",
    "DetectorElementPhysicalSize",
    "DetectorElementSpacing",
    "DetectorActiveShape",
    "DetectorActiveDimension",
    "DetectorActiveOrigin",
    "FieldOfViewOrigin",
    "FieldOfViewRotation",
    "FieldOfViewHorizontalFlip",
    "GridAbsorbingMaterial",
    "GridSpacingMaterial",
    "GridThickness",
    "GridPitch",
    "GridAspectRatio",
    "GridPeriod",
    "GridFocalDistance",
    "FilterMaterial",
    "FilterThicknessMinimum",
    "FilterThicknessMaximum",
    "ExposureControlMode",
    "ExposureControlModeDescription",
    "ExposureStatus",
    "PhototimerSetting",
    "ExposureTimeInuS",
    "XRayTubeCurrentInuA",
    "ContentQualification",
    "PulseSequenceName",
    "MRImagingModifierSeq",
    "EchoPulseSeq",
    "InversionRecovery",
    "FlowCompensation",
    "MultipleSpinEcho",
    "MultiPlanarExcitation",
    "PhaseContrast",
    "TimeOfFlightContrast",
    "Spoiling",
    "SteadyStatePulseSeq",
    "EchoPlanarPulseSeq",
    "TagAngleFirstAxis",
    "MagnetizationTransfer",
    "T2Preparation",
    "BloodSignalNulling",
    "SaturationRecovery",
    "SpectrallySelectedSuppression",
    "SpectrallySelectedExcitation",
    "SpatialPreSaturation",
    "Tagging",
    "OversamplingPhase",
    "TagSpacingFirstDimension",
    "GeometryOfKSpaceTraversal",
    "SegmentedKSpaceTraversal",
    "RectilinearPhaseEncodeReordering",
    "TagThickness",
    "PartialFourierDirection",
    "GatingSynchronizationTechnique",
    "ReceiveCoilManufacturerName",
    "MRReceiveCoilSeq",
    "ReceiveCoilType",
    "QuadratureReceiveCoil",
    "MultiCoilDefinitionSeq",
    "MultiCoilConfiguration",
    "MultiCoilElementName",
    "MultiCoilElementUsed",
    "MRTransmitCoilSeq",
    "TransmitCoilManufacturerName",
    "TransmitCoilType",
    "SpectralWidth",
    "ChemicalShiftReference",
    "VolumeLocalizationTechnique",
    "MRAcquisitionFrequencyEncodingSteps",
    "DeCoupling",
    "DeCoupledNucleus",
    "DeCouplingFrequency",
    "DeCouplingMethod",
    "DeCouplingChemicalShiftReference",
    "KSpaceFiltering",
    "TimeDomainFiltering",
    "NumberOfZeroFills",
    "BaselineCorrection",
    "CardiacRRIntervalSpecified",
    "AcquisitionDuration",
    "DiffusionDirectionality",
    "DiffusionGradientDirectionSeq",
    "ParallelAcquisition",
    "ParallelAcquisitionTechnique",
    "InversionTimes",
    "MetaboliteMapDescription",
    "PartialFourier",
    "EffectiveEchoTime",
    "ChemicalShiftSeq",
    "CardiacSignalSource",
    "DiffusionBValue",
    "DiffusionGradientOrientation",
    "VelocityEncodingDirection",
    "VelocityEncodingMinimumValue",
    "NumberOfKSpaceTrajectories",
    "CoverageOfKSpace",
    "SpectroscopyAcquisitionPhaseRows",
    "ParallelReductionFactorInPlane",
    "TransmitterFrequency",
    "ResonantNucleus",
    "FrequencyCorrection",
    "MRSpectroscopyFOVGeometrySeq",
    "SlabThickness",
    "SlabOrientation",
    "MidSlabPosition",
    "MRSpatialSaturationSeq",
    "MRTimingAndRelatedParametersSeq",
    "MREchoSeq",
    "MRModifierSeq",
    "MRDiffusionSeq",
    "CardiacTriggerSeq",
    "MRAveragesSeq",
    "MRFOVGeometrySeq",
    "VolumeLocalizationSeq",
    "SpectroscopyAcquisitionDataColumns",
    "DiffusionAnisotropyType",
    "MetaboliteMapSeq",
    "ParallelReductionFactorOutOfPlane",
    "SpectroscopyAcquisitionOutOfPlanePhaseSteps",
    "BulkMotionStatus",
    "ParallelReductionFactorSecondInPlane",
    "CardiacBeatRejectionTechnique",
    "RespiratoryMotionCompensation",
    "RespiratorySignalSource",
    "BulkMotionCompensationTechnique",
    "BulkMotionSignal",
    "ApplicableSafetyStandardAgency",
    "ApplicableSafetyStandardVersion",
    "OperationModeSeq",
    "OperatingModeType",
    "OperationMode",
    "SpecificAbsorptionRateDefinition",
    "GradientOutputType",
    "SpecificAbsorptionRateValue",
    "GradientOutput",
    "FlowCompensationDirection",
    "TaggingDelay",
    "ChemicalShiftsMinimumIntegrationLimit",
    "ChemicalShiftsMaximumIntegrationLimit",
    "MRVelocityEncodingSeq",
    "FirstOrderPhaseCorrection",
    "WaterReferencedPhaseCorrection",
    "MRSpectroscopyAcquisitionType",
    "RespiratoryMotionStatus",
    "VelocityEncodingMaximumValue",
    "TagSpacingSecondDimension",
    "TagAngleSecondAxis",
    "FrameAcquisitionDuration",
    "MRImageFrameTypeSeq",
    "MRSpectroscopyFrameTypeSeq",
    "MRAcquisitionPhaseEncodingStepsInPlane",
    "MRAcquisitionPhaseEncodingStepsOutOfPlane",
    "SpectroscopyAcquisitionPhaseColumns",
    "CardiacMotionStatus",
    "SpecificAbsorptionRateSeq",
    "SeriesNumber",
    "AcquisitionNumber",
    "InstanceNumber",
    "ItemNumber",
    "PatientOrientation",
    "OverlayNumber",
    "CurveNumber",
    "LUTNumber",
    "ImagePosition",
    "ImageOrientation",
    "Laterality",
    "ImageLaterality",
    "TemporalPositionIdentifier",
    "NumberOfTemporalPositions",
    "TemporalResolution",
    "SeriesInStudy",
    "ImagesInAcquisition",
    "AcquisitionsInStudy",
    "PositionReferenceIndicator",
    "SliceLocation",
    "OtherStudyNumbers",
    "NumberOfPatientRelatedStudies",
    "NumberOfPatientRelatedSeries",
    "NumberOfPatientRelatedInstances",
    "NumberOfStudyRelatedSeries",
    "NumberOfStudyRelatedInstances",
    "NumberOfSeriesRelatedInstances",
    "StackID",
    "InStackPositionNumber",
    "FrameAnatomySeq",
    "FrameLaterality",
    "FrameContentSeq",
    "PlanePositionSeq",
    "PlaneOrientationSeq",
    "TemporalPositionIndex",
    "TriggerDelayTime",
    "FrameAcquisitionNumber",
    "DimensionIndexValues",
    "FrameComments",
    "InConcatenationNumber",
    "InConcatenationTotalNumber",
    "DimensionIndexPointer",
    "FunctionalGroupSequencePointer",
    "DimensionIndexPrivateCreator",
    "DimensionOrganizationSeq",
    "DimensionSeq",
    "ConcatenationFrameOffsetNumber",
    "FunctionalGroupPrivateCreator",
    "SamplesPerPixel",
    "PhotometricInterpretation",
    "PlanarConfiguration",
    "NumberOfFrames",
    "FrameIncrementPointer",
    "Rows",
    "Columns",
    "Planes",
    "UltrasoundColorDataPresent",
    "PixelSpacing",
    "ZoomFactor",
    "ZoomCenter",
    "PixelAspectRatio",
    "CorrectedImage",
    "BitsAllocated",
    "BitsStored",
    "HighBit",
    "PixelRepresentation",
    "SmallestImagePixelValue",
    "LargestImagePixelValue",
    "SmallestPixelValueInSeries",
    "LargestPixelValueInSeries",
    "SmallestImagePixelValueInPlane",
    "LargestImagePixelValueInPlane",
    "PixelPaddingValue",
    "QualityControlImage",
    "BurnedInAnnotation",
    "PixelIntensityRelationship",
    "PixelIntensityRelationshipSign",
    "WindowCenter",
    "WindowWidth",
    "RescaleIntercept",
    "RescaleSlope",
    "RescaleType",
    "WindowCenterWidthExplanation",
    "RecommendedViewingMode",
    "RedPaletteColorLUTDescriptor",
    "GreenPaletteColorLUTDescriptor",
    "BluePaletteColorLUTDescriptor",
    "RedPaletteColorLUTData",
    "GreenPaletteColorLUTData",
    "BluePaletteColorLUTData",
    "SegmentedRedPaletteColorLUTData",
    "SegmentedGreenPaletteColorLUTData",
    "SegmentedBluePaletteColorLUTData",
    "ImplantPresent",
    "PartialView",
    "PartialViewDescription",
    "LossyImageCompression",
    "LossyImageCompressionRatio",
    "ModalityLUTSeq",
    "LUTDescriptor",
    "LUTExplanation",
    "ModalityLUTType",
    "LUTData",
    "VOILUTSeq",
    "SoftcopyVOILUTSeq",
    "BiPlaneAcquisitionSeq",
    "RepresentativeFrameNumber",
    "FrameNumbersOfInterest",
    "FrameOfInterestDescription",
    "MaskPointer",
    "RWavePointer",
    "MaskSubtractionSeq",
    "MaskOperation",
    "ApplicableFrameRange",
    "MaskFrameNumbers",
    "ContrastFrameAveraging",
    "MaskSubPixelShift",
    "TIDOffset",
    "MaskOperationExplanation",
    "DataPointRows",
    "DataPointColumns",
    "SignalDomain",
    "LargestMonochromePixelValue",
    "DataRepresentation",
    "PixelMatrixSeq",
    "FrameVOILUTSeq",
    "PixelValueTransformationSeq",
    "SignalDomainRows",
    // "StudyStatusID",
    // "StudyPriorityID",
    // "StudyVerifiedTime",
    // "StudyReadTime",
    // "ScheduledStudyStartTime",
    // "ScheduledStudyStopTime",
    // "StudyArrivalTime",
    // "StudyCompletionTime",
    // "StudyComponentStatusID",
    // "RequestedProcedureCodeSeq",
    // "RefPatientAliasSeq",
    // "VisitStatusID",
    "RouteOfAdmissions",
    // "ScheduledAdmissionTime",
    // "ScheduledDischargeTime",
    // "DischargeTime",
    "DischargeDiagnosisCodeSeq",
    "WaveformOriginality",
    "NumberOfWaveformChannels",
    "NumberOfWaveformSamples",
    "SamplingFrequency",
    "MultiplexGroupLabel",
    "ChannelDefinitionSeq",
    "WaveformChannelNumber",
    "ChannelLabel",
    "ChannelStatus",
    "ChannelSourceSeq",
    "ChannelSourceModifiersSeq",
    "SourceWaveformSeq",
    "ChannelDerivationDescription",
    "ChannelSensitivity",
    "ChannelSensitivityUnitsSeq",
    "ChannelSensitivityCorrectionFactor",
    "ChannelBaseline",
    "ChannelTimeSkew",
    "ChannelSampleSkew",
    "ChannelOffset",
    "WaveformBitsStored",
    "FilterLowFrequency",
    "FilterHighFrequency",
    "NotchFilterFrequency",
    "NotchFilterBandwidth",
    // "SPSStartTime",
    // "SPSEndTime",
    // "ScheduledProtocolCodeSeq",
    // "SPSID",
    // "SPSStatus",
    // "SPSSeq",
    "RefNonImageCompositeSOPInstanceSeq",
    // "PPSStartTime",
    // "PPSEndTime",
    // "PPSStatus",
    // "PerformedProcedureTypeDescription",
    // "PerformedProtocolCodeSeq",
    // "ScheduledStepAttributesSeq",
    // "PPSDiscontinuationReasonCodeSeq",
    "QuantitySeq",
    "Quantity",
    "MeasuringUnitsSeq",
    // "BillingItemSeq",
    "TotalTimeOfFluoroscopy",
    "TotalNumberOfExposures",
    "EntranceDose",
    "ExposedArea",
    "DistanceSourceToEntrance",
    "DistanceSourceToSupport",
    "ExposureDoseSeq",
    // "CommentsOnRadiationDose",
    "XRayOutput",
    "HalfValueLayer",
    "OrganDose",
    "OrganExposed",
    // "BillingProcedureStepSeq",
    // "FilmConsumptionSeq",
    // "BillingSuppliesAndDevicesSeq",
    // "RefProcedureStepSeq",
    // "PerformedSeriesSeq",
    // "SPSComments",
    "SpecimenAccessionNumber",
    "SpecimenSeq",
    "SpecimenIdentifier",
    "AcquisitionContextDescription",
    "SpecimenTypeCodeSeq",
    "SlideIdentifier",
    "ImageCenterPointCoordinatesSeq",
    "XOffsetInSlideCoordinateSystem",
    "YOffsetInSlideCoordinateSystem",
    "ZOffsetInSlideCoordinateSystem",
    "PixelSpacingSeq",
    "CoordinateSystemAxisCodeSeq",
    "MeasurementUnitsCodeSeq",
    "RequestedProcedureID",
    "ReasonForTheRequestedProcedure",
    "RequestedProcedurePriority",
    "ConfidentialityCode",
    "ReportingPriority",
    "IssueTimeOfImagingServiceRequest",
    "EntranceDoseInmGy",
    "RealWorldValueMappingSeq",
    "LUTLabel",
    "RealWorldValueLUTLastValueMappedUS",
    "RealWorldValueLUTData",
    "RealWorldValueLUTFirstValueMappedUS",
    "RealWorldValueIntercept",
    "RealWorldValueSlope",
    "RelationshipType",
    "ValueType",
    "ConceptNameCodeSeq",
    "ContinuityOfContent",
    // "VerifyingObserverSeq",
    "RefWaveformChannels",
    "Time",
    "TemporalRangeType",
    "RefSamplePositions",
    "RefFrameNumbers",
    "RefTimeOffsets",
    // "TextValue",
    "ConceptCodeSeq",
    "AnnotationGroupNumber",
    "ModifierCodeSeq",
    "MeasuredValueSeq",
    "NumericValue",
    "PredecessorDocumentsSeq",
    "RefRequestSeq",
    // "PerformedProcedureCodeSeq",
    // "CurrentRequestedProcedureEvidenceSeq",
    // "PertinentOtherEvidenceSeq",
    "CompletionFlag",
    "CompletionFlagDescription",
    "VerificationFlag",
    "ContentTemplateSeq",
    "IdenticalDocumentsSeq",
    // "AnnotationSeq",
    "TemplateIdentifier",
    "TemplateVersion",
    "TemplateLocalVersion",
    "TemplateExtensionFlag",
    "RefContentItemIdentifier"
];

// FIXMEs:
// - if in getSpecificReplacer.dicom: 'TagName': function() {return "mystring"} doesn't ADD the tag if not there.
// - clone $dicomDOM more easily
// - verify hashUID function

// NOTE: not writing into options.status because of performance reasons

// from mapdefaults.js
var defaultEmpty = tagNamesToEmpty;
var replaceUIDs = instanceUIDs;

var startConfigs = {
    cfDicomSort:
    "// Basic dicom sort:\n" +
    "// This config just sorts images based on dicom header info.\n" +
    "// USE WITH 'noAnonymization' flag!\n" +
    "dicom = {\n" +
    "" +
    "};\n" +
    "filePath = [\n" +
    "    parser.getDicom('PatientName'),\n" +
    "    parser.getDicom('Modality'),\n" +
    "    parser.getDicom('StudyDate') + '_' + parser.getDicom('StudyDescription'),\n" +
    "    parser.getDicom('SeriesNumber'),\n" +
    "    parser.getDicom('SeriesDescription') + '_' + parser.getDicom('SeriesNumber'),\n" +
    "    parser.getDicom('InstanceNumber') + '.dcm'\n" +
    "];",
    cfFullExample: "dicom = {\n" +
    "// List DICOM Header tags for which you want to change values:\n" +
    "// It's important to assign something to PatientName and PatientID as otherwise\n" +
    "// they will just get emptied by the default behaviour\n" +
    "    'PatientName': function() {\n" +
    "        // set to a static value\n" +
    "        // return 'myID';\n" +
    "        // OR set to header value of same DICOM instance\n" +
    "        // return parser.getDicom('PatientID')\n" +
    "        // OR set to a component of the files directory path\n" +
    "        return parser.getFilePathComp('centersubj');\n" +
    "    },\n" +
    "    // this example replaces the patient name per mapping table column labeled 'CURR_ID' (original)\n" +
    "    // and 'NEW_ID' (target)\n" +
    "    'PatientID': function() {\n" +
    "        return parser.getMapping(parser.getDicom('PatientID'), 'CURR_ID', 'NEW_ID');\n" +
    "    },\n" +
    "    // this example finds the patientname in mapping table column 0 and offsets the CONTENTDATE by days per column 2\n" +
    "    'ContentDate': function() {\n" +
    "        return parser.addDays(parser.getDicom('StudyDate'), parser.getMapping(\n" + 
    "            parser.getDicom('PatientID'), 'CURR_ID', 'DATE_OFFSET'));\n" +
    "    },\n" +
    "};\n" +
    "// filePath lists the components of the new path to be written.\n" +
    "// If taken from old path, component names must be available in filePathPattern,\n" +
    "// and actual file path must be deep enough for getFilePathComp to find its match\n" +
    "filePath = [\n" +
    "    parser.getFilePathComp('trialname'),\n" +
    "    parser.getFilePathComp('centersubj') + '_OR_' + parser.getDicom('PatientID'),\n" +
    "    parser.getDicom('StudyDate'),\n" +
    "    parser.getDicom('SeriesDescription') + '_' + parser.getDicom('SeriesNumber'),\n" +
    "    parser.getDicom('InstanceNumber') + '.dcm'\n" +
    "];"
};



// TODO: extract below specific instructions from UI
var getSpecificReplacer = function(parser, specificMapConfigs) {
    try {
        var f = new Function('parser', 'var dicom, filePath; ' +
                specificMapConfigs +
                '\nreturn {dicom: dicom, filePath: filePath};');
        return f(parser);
    }
    catch(e) {
        throw('invalid mapping instructions in editor:\n' + e.toString());
    }
};


// (parser is created once per run)
// TODO: var mapTable = list of lists read from mappingFilePath
var getParser = function($oldDicomDom, mapTable, filePath, options, status) {
    var csvHeaders = mapTable.header;
    var csvData = mapTable.data;
    return {
        getMapping: function(matchValue, matchHeader, mapHeader) {
            var matchIndex = csvHeaders.indexOf(matchHeader);
            var newIndex = csvHeaders.indexOf(mapHeader);

            var mapRow = csvData.filter(function(row) {
                return row[matchIndex] === matchValue;
            });
            if (mapRow.length) {
                return mapRow[0][newIndex];
            } else {
                status.mapFailed = true;
                // TODO: create a downloadable log
                var issue = ("Warning: No value '" + matchValue +
                      "' found in mapping table column " + matchHeader);
                status.log.push(issue);
                // options.status(issue);
            }
        },
        // compName should be in filePathCompNames
        getFilePathComp: function(compName) {
            // filePathPattern describes the expectations of where file path components are found in case
            // they are needed for populating dicom or for saving
            var filePathCompNames = options.filePathPattern.replace(/^\/|\/$/g, '').split('/');
            var idx = filePathCompNames.indexOf(compName);
            // slice: path starts with / and first split is ""
            var pathComps = filePath.split("/").slice(1);
            if (idx == -1 || idx >= pathComps.length) {
                var issue;
                if (idx == -1) {
                    issue = "Warning: path component name not found in component names list";
                }
                if (idx >= pathComps.length) {
                    issue = "Warning: the specified path component is deeper than the available directory hierarchy";
                }
                status.filePathFailed = true;
                status.log.push(issue);
                // options.status(issue);
                if (options.mapOptions.requireDirectoryMatch) {
                    throw(issue);
                }
                return "invalidpath";
            }
            return pathComps[idx];
        },
        getDicom: function(tagName) {
            var ret = $oldDicomDom.find('[name=' + tagName + ']').text();
            // we do this check so that a specific operation never gets access
            // to the old UIDs but always the new ones
            if (replaceUIDs.indexOf(tagName) > -1) {
                ret = hashUID(ret);
            }
            return ret;
        },

        // function is parked here for the access to status. Will likely change
        addDays: function(dcmDate, numDays) {
            var dcmFormat = "YYYYMMDD";
            // just to make sure
            dcmDate = String(dcmDate);
            var currDate = moment(dcmDate, dcmFormat);
            if (!currDate.isValid()) {
                var issue = "Warning: no valid date found when trying to add days in mapper";
                status.log.push(issue);
                // options.status(issue);
                return "";
            }
            else {
                return currDate.add(numDays, 'days').format(dcmFormat);
            }
        }
    };
};


// make file path components file system safe
var cleanFilePath = function(arr) {
    return arr.map(function(comp) {
        if (typeof comp == 'undefined' || comp == '') {
            comp = 'unavailable';            
        }
        return encodeURIComponent(comp.replace(/[ \/]/g, '_'));
    });
};

// tag manipulation functions
// empty if present
function tagEmpty(jQDom, name) {
    var el = jQDom.find('[name=' + name + ']');
    var hadContent = !!el.text();
    el.text("");
    return hadContent;
}

function tagReplace(jQDom, name, value) {
    // (ensure it's used as a setter with the || "")
    jQDom.find('[name=' + name + ']').text(value || "");
}

// example implementation
function tagAsAnonymized(jQDom, mapOptions) {
    function optionsAsString() {
        // need to keep the full tag under 64 chars!
        var options = [];
        ['keepPrivateTags', 'keepWhitelistedTagsOnly']
            .forEach(function(optName) {
                if (mapOptions[optName]) {
                    options.push(optName);
                }
            });
        return options.length ? ' - ' + options.join(', ') : '';
        // return Object.keys(mapOptions).map(function(key) {
        //     return key + ":" + mapOptions[key];
        // }).join(", ");
    }
    // set Patient Identity Removed to YES
    jQDom.find("data-set").append($(
            "<element " +
                "name='PatientIdentityRemoved'" +
                "tag = '0012,0062'" +
                "vr = 'CS'" +
            ">").append("YES"))
    // set Deidentification method
        .append($(
            "<element " +
                "name='DeIdentificationMethod'" +
                "tag = '0012,0063'" +
                "vr = 'LO'" +
            ">").append("dcmjs.org" + optionsAsString()));
}

function hashUID(uid) {

    /*
     * comment references:
     * [1]: http://www.itu.int/rec/T-REC-X.667-201210-I/en
     */

    // FIXME: UUID calculation may not be working correctly.
    function hexStrToBytes(str) {
        var result = [];
        while (str.length >= 2) { 
            result.push(parseInt(str.substring(0, 2), 16));
            str = str.substring(2, str.length);
        }

        return result;
    }
    function byteToHexStr(b) {
        return ((b >> 4) & 0x0f).toString(16) + (b & 0x0f).toString(16);
    }

    // verify whether the dicom UID byte representation is a byte representation of strings,
    // or does the uid need to be converted before? (question is referenced below)
    function dicomUidToBytes(uid) {
        var bytes = [];
        for (var i = 0; i < uid.length; ++i) {
            bytes.push(uid.charCodeAt(i));
        }
        return bytes;
    }

    // we're following [1], 14, sub-case 14.3 (SHA1 based)
    // 14.1 bullet 1
    // allocating the namespace for OID based UUIDs
    // from: [1], D.9 "Name string is an OID"
    var nsUUID = "6ba7b8129dad11d180b400c04fd430c8";

    // 14.1 bullet 2, convert name to canonical seq of octets (idea tb verified)
    var nsUUIDBytes = hexStrToBytes(nsUUID);

    // 14.1, bullet 3, compute 16-octet hash value of name space identifier concatenated with name,
    // using SHA-1. (The sentence with "the numbering is..." is tb verified - byte sequence ok?).
    // This hash value is calculated per 14.3. Just quick verification of byte sequence required
    // Question: the DICOM UID is a string - does it need any conversion before hashing? Here I assume not.
    var uidBytes = dicomUidToBytes(uid);
    // Compute the final 16-octet hash value of the name space identifier concatenated with the name
    // First concatenate
    var concatBytes = nsUUIDBytes.concat(uidBytes);
    // in order to hash the bytes, here I'm converting them to a string first.
    var concatAsString = concatBytes.map(function(c){return String.fromCharCode(parseInt(c, 10));}).join("");
    // Then I apply the sha1 on the string.
    // Question: does sha1() do the right thing? Can we compare to any other sha1 given same input? (
    // ideally the byte input). I'm actually pretty sure it's not the right thing, as I've tested it against
    // the example on http://de.wikipedia.org/wiki/Universally_Unique_Identifier.
    // --> The bytes match but the calculated hash is not the same.
    // Maybe because strings with non-UTF-8 chars get modified inside sha1() -> better sha1 available?
    var hashValue = sha1(concatAsString);
    // 14.1, bullets 4-6:
    // Set octets 3 through 0 of the "TimeLow" field to octets 3 through 0 of the hash value.
    // Set octets 1 and 0 of the "TimeMid" field to octets 5 and 4 of the hash value.
    // Set octets 1 and 0 of the "VersionAndTimeHigh" field to octets 7 and 6 of the hash value.
    // Question: is there any rearrangement taking place or is the outcome just identical to the
    // byte representation of hashValue? (if yes, I won't need the hashBytes variable for now and stick to the hex hashValue)
    var hashBytes = hexStrToBytes(hashValue);
    // 14.1, bullet 7: overwrite the four most sig bits... with the 4-bit version number from Table3 of 12.2..
    // -> in our case that's "0101" or 5
    // bullet 8: more placing of octets in sequence (?)
    // bullet 9: overwrite 2 most sig bits of VariantAndClockSeqHigh with 1 and 0
    // --> Question: I'm not sure on bullet 9, may have to do a bit level operation there, not sure hex rep
    // does it.
    // I did something pro forma (adding the string "9") but also placing needs to be reviewed
    // (and remaining bullets in 14.1: add rest of bytes in sequence, to be verified)
    // Btw: I truncate the hash to 16 octets = 32 hex values happens here.
    var nameUUID = hashValue.slice(0, 12) + "5" + hashValue.slice(13, 16) + "9" + hashValue.slice(17, 32);

    // finally, casting to a UID again. Need to convert nameUUID to an integer.
    // I'm doing this quick and dirty here, but the String casting may need some left padding
    // overall, this conversion needs a quick check
    return "2.25." + hexStrToBytes(nameUUID).join("");
}

/*
 * options - currently only passed for adding options to DICOM header after anonymization
 */
var applyReplaceDefaults = function(jQDom, specificReplace, parser, options, status) {
    function unlessSpecified(tagList) {
        return tagList.filter(function(tag) {
            return !(tag in specificReplace.dicom);
        });
    }
    // empty all tags in defaultEmpty, unless there's a specific instruction
    // to do something else
    unlessSpecified(defaultEmpty).forEach(function(name) {
        var hadContent = tagEmpty(jQDom, name);
        if (hadContent) {
            var info = ("Info: Emptying <" + name + ">");
            status.log.push(info);
            // options.status(info);
        }
    });
    // hash all UIDs in replaceUID, unless there's a specific instruction
    // to do something else
    unlessSpecified(replaceUIDs).forEach(function(uidName) {
        // this is counterintuitive but getDicom already hashes UIDs, so
        // we can never use the original value. Just get the value
        // and replace the existing one
        tagReplace(jQDom, uidName, parser.getDicom(uidName));
    });
    // last, a few special cases
    tagAsAnonymized(jQDom, options.mapOptions);
};

var removePrivateTags = function(jQDom) {
    jQDom.find("data-set > element").each(function() {
        var tag = this.getAttribute('tag');
        var tagIsPrivate = (Number("0x"+tag[3]) % 2 === 1);
        if (tagIsPrivate) {
            this.remove();
        }
    });
};

var removeNonWhitelistedTags = function(jQDom, whiteListTags, specialTags, instanceUids) {
    jQDom.find("data-set > element").each(function(idx, elm) {
        var name = elm.getAttribute('name');
        if (whiteListTags.concat(specialTags).concat(instanceUids)
                .indexOf(name) == -1) {
            elm.innerHTML = "";
        }
    });
};

// in main func:
// read from old dicom dom and write to new dicomdom
var mapDom = function(xmlString, filePath, csvMappingTable, options) {
    var status = {log: [], mapFailed: false};
    // TODO: we can probably get rid of this default setting action. options.mapOptions undefined
    // would be a problem anyway
    options = options || {};
    ['noAnonymization', 'requireDirectoryMatch', 'keepWhitelistedTagsOnly', 'keepPrivateTags']
            .forEach(function(optName) {
        if (typeof options.mapOptions[optName] == 'undefined') options.mapOptions[optName] = false;
    });

    // make a DOM to query and a DOM to update
    var $oldDicomDOM = $($.parseXML(xmlString));
    var $newDicomDOM = $($.parseXML(xmlString));

    var parser = getParser($oldDicomDOM, csvMappingTable, filePath, options, status);

    //removePrivateTags($newDicomDOM);
    removeNonWhitelistedTags($newDicomDOM, tagNamesToAlwaysKeep, [], instanceUIDs);
        
    return {
        dicom: $newDicomDOM,
        status: status
    };
};
