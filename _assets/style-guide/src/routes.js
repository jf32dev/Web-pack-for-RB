/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import {
  ScaffoldingView,
  TypographyView,
  EditorView,
  FabricEditorView,
  BtnView,
  CarouselView,
  TextView,
  FrameView,
  IconView,
  IconsView,
  ImageCropView,
  FileEditListView,
  FileListView,
  BlankslateView,
  NavMenuView,
  ListView,
  LoaderView,
  ModalView,
  DialogView,
  ColoursView,
  SelectView,
  SelectSearchView,
  MultiSelectView,
  StringsView,
  NumbersView,
  DatesView,
  CheckboxView,
  DropMenuView,
  AccordionView,
  RadioView,
  SearchModalView,
  SearchItemView,
  TagsView,
  TemplateEditorView,
  DateTimePickerView,
  MetadataView,
  SearchListView,
  ChatView,
  ChatFloatingListView,
  ChatIncomingCallView,
  ChatMessagesView,
  ChatRoomView,
  ChatRosterView,
  ChatUserDetailsView,
  MapView,
  PraisesView,
  SocialLinksView,
  UserProfileView,
  UserNotificationsView,
  AuthView,
  TextareaView,
  BreadcrumbsView,
  BreadcrumbListView,
  BroadcastView,
  CommentsView,
  PromptsView,
  StoryEditSharingView,
  TooltipsView,
  KloudlessView,
  RecordAudioView,
  ReportsView,
  ColourPickerView,
  FeaturedSliderView,
  CountBadgeView,
  PublicShareView,
  RangeSliderView,
  WelcomeScreensView,
  BlockSearchView,
  PageSearchView,

  BookmarkItemView,
  CategoryItemView,
  ChannelItemView,
  CourseItemView,
  EventItemView,
  FileItemView,
  FormItemView,
  GroupItemView,
  InterestAreaItemView,
  NoteItemView,
  NotificationItemView,
  RepoItemView,
  RevisionItemView,
  ShareItemView,
  ShareRecipientItemView,
  StoryCardView,
  StoryItemView,
  TabItemView,
  WebItemView,
  UserItemView,

  StoryDescriptionView,
  StoryHeaderView,

  ViewerView,
  CalendarView,

  AudioVideoView,
  CsvView,
  EpubViewer,
  FormViewerView,
  ImageViewerView,
  PdfViewerView,
  PlaintextView,
  PresentationViewerView,
  SpreadsheetViewerView,
  AppViewerView,

  FormCategoryEditView,

  CanvasEditorView,

  AdminMenuView,
  AdminBadgeSelectorView,
  AdminBulkUploadView,
  AdminConfigurationBundleView,
  AdminConfigurationBundleEdit,
  AdminManageEmailsView,
  AdminManageListView,
  AdminModalsView,
  AdminScoreSelectorView,
  AdminVisualiseRelationshipsView,

  AdminSMTPServerSetupView,
  AdminCustomizationView,
  AdminCustomWelcomeView,
  AdminStoryDefaultsView,
  AdminSecurityGeneralView,
  AdminPasswordRulesView,
  AdminDevicesView,
  AdminStoryArchivingView,
  AdminCoverArtView,
  AdminTagsView,
  AdminSecurityAuthenticationView,
  AdminFileUploadsView,
  AdminCloudServicesView,
  AdminSyncEngineView,
  AdminUserMetadataView,
  AdminGeneralGeneralView,
  AdminHomeScreensView,
  AdminCrmIntegrationView,
  AdminCustomAppsView,
  AdminNamingConventionView,

  BulkListItemView,
  HubShareConsoleView,
  ProgressBarView,
  GeneratePdfThumbnailsView,
} from 'containers';

// Routes split in to sections for navigation
// Index route defined manually in router and render()
export default [{
  id: 'general',
  title: 'General',
  routes: [
    { to: '/scaffolding', name: 'Scaffolding', comp: ScaffoldingView },
    { to: '/typography', name: 'Typography', comp: TypographyView },
    { to: '/icons', name: 'Icons', comp: IconsView },
    { to: '/colours', name: 'Colours', comp: ColoursView },
    { to: '/tooltips', name: 'Tooltips', comp: TooltipsView },
  ]
}, {
  id: 'globalisation',
  title: 'Globalisation',
  routes: [
    { to: '/strings', name: 'Strings', comp: StringsView },
    { to: '/numbers', name: 'Numbers', comp: NumbersView },
    { to: '/dates', name: 'Dates', comp: DatesView },
  ]
}, {
  id: 'components',
  title: 'Components',
  routes: [
    { to: '/Auth', name: 'Auth', comp: AuthView },
    { to: '/Accordion', name: 'Accordion', comp: AccordionView },
    { to: '/Blankslate', name: 'Blankslate', comp: BlankslateView },
    { to: '/Breadcrumbs', name: 'Breadcrumbs', comp: BreadcrumbsView },
    { to: '/BreadcrumbList', name: 'BreadcrumbList', comp: BreadcrumbListView },
    { to: '/Broadcast', name: 'Broadcast', comp: BroadcastView },
    { to: '/Calendar', name: 'Calendar', comp: CalendarView },
    { to: '/Carousel', name: 'Carousel', comp: CarouselView },
    { to: '/Comments', name: 'Comments', comp: CommentsView },
    { to: '/CountBadge', name: 'CountBadge', comp: CountBadgeView },
    { to: '/Dialog', name: 'Dialog', comp: DialogView },
    { to: '/DropMenu', name: 'DropMenu', comp: DropMenuView },
    { to: '/Editor', name: 'Editor', comp: EditorView },
    { to: '/FabricEditor', name: 'FabricEditor', comp: FabricEditorView },
    { to: '/FeaturedSlider', name: 'FeaturedSlider', comp: FeaturedSliderView },
    { to: '/FileList', name: 'FileList', comp: FileListView },
    { to: '/Frame', name: 'Frame', comp: FrameView },
    { to: '/Icon', name: 'Icon', comp: IconView },
    { to: '/ImageCrop', name: 'ImageCrop', comp: ImageCropView },
    { to: '/Kloudless', name: 'Kloudless', comp: KloudlessView },
    { to: '/Loader', name: 'Loader', comp: LoaderView },
    { to: '/List', name: 'List', comp: ListView },
    { to: '/Map', name: 'Map', comp: MapView },
    { to: '/Modal', name: 'Modal', comp: ModalView },
    { to: '/NavMenu', name: 'NavMenu', comp: NavMenuView },
    { to: '/Praises', name: 'Praises', comp: PraisesView },
    { to: '/ProgressBar', name: 'ProgressBar', comp: ProgressBarView },
    { to: '/Prompts', name: 'Prompts', comp: PromptsView },
    { to: '/PublicShare', name: 'Public Share', comp: PublicShareView },
    { to: '/RecordAudio', name: 'RecordAudio', comp: RecordAudioView },
    { to: '/Reports', name: 'Reports', comp: ReportsView },
    { to: '/SocialLinks', name: 'SocialLinks', comp: SocialLinksView },
    { to: '/Tags', name: 'Tags', comp: TagsView },
    { to: '/TemplateEditor', name: 'TemplateEditor', comp: TemplateEditorView },
    { to: '/WelcomeScreens', name: 'WelcomeScreens', comp: WelcomeScreensView },
  ]
}, {
  id: 'form',
  title: 'Form Components',
  routes: [
    { to: '/Btn', name: 'Btn', comp: BtnView },
    { to: '/Checkbox', name: 'Checkbox', comp: CheckboxView },
    { to: '/ColourPicker', name: 'ColourPicker', comp: ColourPickerView },
    { to: '/DateTimePicker', name: 'DateTimePicker', comp: DateTimePickerView },
    { to: '/MultiSelect', name: 'MultiSelect', comp: MultiSelectView },
    { to: '/Radio', name: 'Radio', comp: RadioView },
    { to: '/Select', name: 'Select', comp: SelectView },
    { to: '/SelectSearch', name: 'SelectSearch', comp: SelectSearchView },
    { to: '/Text', name: 'Text', comp: TextView },
    { to: '/Textarea', name: 'Textarea', comp: TextareaView },
    { to: '/RangeSlider', name: 'RangeSlider', comp: RangeSliderView },
  ]
}, {
  id: 'listItems',
  title: 'List items',
  routes: [
    { to: '/BookmarkItem', name: 'BookmarkItem', comp: BookmarkItemView },
    { to: '/CategoryItem', name: 'CategoryItem', comp: CategoryItemView },
    { to: '/ChannelItem', name: 'ChannelItem', comp: ChannelItemView },
    { to: '/CourseItem', name: 'CourseItem', comp: CourseItemView },
    { to: '/EventItem', name: 'EventItem', comp: EventItemView },
    { to: '/FileItem', name: 'FileItem', comp: FileItemView },
    { to: '/FormItem', name: 'FormItem', comp: FormItemView },
    { to: '/GroupItem', name: 'GroupItem', comp: GroupItemView },
    { to: '/InterestAreaItem', name: 'InterestAreaItem', comp: InterestAreaItemView },
    { to: '/NoteItem', name: 'NoteItem', comp: NoteItemView },
    { to: '/NotificationItem', name: 'NotificationItem', comp: NotificationItemView },
    { to: '/RepoItem', name: 'RepoItem', comp: RepoItemView },
    { to: '/RevisionItem', name: 'RevisionItem', comp: RevisionItemView },
    { to: '/ShareItem', name: 'ShareItem', comp: ShareItemView },
    { to: '/ShareRecipientItem', name: 'ShareRecipientItem', comp: ShareRecipientItemView },
    { to: '/StoryCard', name: 'StoryCard', comp: StoryCardView },
    { to: '/StoryItem', name: 'StoryItem', comp: StoryItemView },
    { to: '/TabItem', name: 'TabItem', comp: TabItemView },
    { to: '/UserItem', name: 'UserItem', comp: UserItemView },
    { to: '/WebItem', name: 'WebItem', comp: WebItemView },
  ]
}, {
  id: 'chat',
  title: 'Chat Components',
  routes: [
    { to: '/Chat', name: 'Chat', comp: ChatView },
    { to: '/ChatFloatingList', name: 'ChatFloatingList', comp: ChatFloatingListView },
    { to: '/ChatIncomingCall', name: 'ChatIncomingCall', comp: ChatIncomingCallView },
    { to: '/ChatMessages', name: 'ChatMessages', comp: ChatMessagesView },
    { to: '/ChatRoom', name: 'ChatRoom', comp: ChatRoomView },
    { to: '/ChatRoster', name: 'ChatRoster', comp: ChatRosterView },
    { to: '/ChatUserDetails', name: 'ChatUserDetails', comp: ChatUserDetailsView },
  ]
}, {
  id: 'search',
  title: 'Search Components',
  routes: [
    { to: '/SearchItems', name: 'Search Items', comp: SearchItemView },
    { to: '/SearchList', name: 'Search List', comp: SearchListView },
    { to: '/SearchModal', name: 'SearchModal', comp: SearchModalView },
    { to: '/BlockSearch', name: 'Block Search', comp: BlockSearchView },
    { to: '/PageSearch', name: 'Page Search', comp: PageSearchView },
  ]
}, {
  id: 'storyDetail',
  title: 'Story Detail Components',
  routes: [
    { to: '/StoryDescription', name: 'StoryDescription', comp: StoryDescriptionView },
    { to: '/StoryHeader', name: 'StoryHeader', comp: StoryHeaderView },
  ]
}, {
  id: 'storyEdit',
  title: 'Story Edit Components',
  routes: [
    { to: '/FileEditList', name: 'FileEditList', comp: FileEditListView },
    { to: '/Metadata', name: 'Metadata', comp: MetadataView },
    { to: '/StoryEditSharing', name: 'StoryEditSharing', comp: StoryEditSharingView },
  ]
}, {  id: 'forms',
  title: 'Forms Components',
  routes: [
    { to: '/FormCategoryEdit', name: 'FormCategoryEdit', comp: FormCategoryEditView }
  ]
}, {
  id: 'fileViewer',
  title: 'File Viewer Components',
  routes: [
    { to: '/Viewer', name: 'Viewer', comp: ViewerView },
    { to: '/AppViewer', name: 'AppViewer', comp: AppViewerView },
    { to: '/AudioVideo', name: 'AudioVideo', comp: AudioVideoView },
    { to: '/Csv', name: 'Csv', comp: CsvView },
    { to: '/EpubViewer', name: 'EpubViewer', comp: EpubViewer },
    { to: '/FormViewer', name: 'FormViewer', comp: FormViewerView },
    { to: '/ImageViewer', name: 'ImageViewer', comp: ImageViewerView },
    { to: '/PdfViewer', name: 'PdfViewer', comp: PdfViewerView },
    { to: '/Plaintext', name: 'Plaintext', comp: PlaintextView },
    { to: '/PresentationViewer', name: 'PresentationViewer', comp: PresentationViewerView },
    { to: '/SpreadsheetViewer', name: 'SpreadsheetViewer', comp: SpreadsheetViewerView },
  ]
}, {
  id: 'userProfile',
  title: 'User Profile Components',
  routes: [
    { to: '/UserProfile', name: 'UserProfile', comp: UserProfileView },
    { to: '/UserNotifications', name: 'UserNotifications', comp: UserNotificationsView },
  ]
}, {
  id: 'canvas',
  title: 'Canvas Components',
  routes: [
    { to: '/CanvasEditor', name: 'CanvasEditor', comp: CanvasEditorView },
  ]
}, {
  id: 'adminComponents',
  title: 'Admin Components',
  routes: [
    { to: '/AdminMenu', name: 'AdminMenu', comp: AdminMenuView },
    { to: '/AdminConfigurationBundleView', name: 'Configuration Bundle List', comp: AdminConfigurationBundleView },
    { to: '/AdminConfigurationBundleEdit', name: 'Configuration Bundle Edit', comp: AdminConfigurationBundleEdit },
    { to: '/AdminManageEmailsView', name: 'Manage Email', comp: AdminManageEmailsView },
    { to: '/AdminManageListView', name: 'Manage Lists', comp: AdminManageListView },
    { to: '/AdminModalsView', name: 'Modals for Manage Lists', comp: AdminModalsView },
    { to: '/AdminBulkUploadMetadata', name: 'Bulk Upload', comp: AdminBulkUploadView },
    { to: '/AdminCrmIntegration', name: 'CRM Integration', comp: AdminCrmIntegrationView },
    { to: '/AdminVisualiseRelationshipsView', name: 'Visualise Relationships', comp: AdminVisualiseRelationshipsView },
    { to: '/AdminBadgeSelector', name: 'Badges Selector', comp: AdminBadgeSelectorView },
    { to: '/AdminScoreSelector', name: 'Score Selector', comp: AdminScoreSelectorView },
    { to: '/AdminSMTPServerSetup', name: 'SMTP Server Setup', comp: AdminSMTPServerSetupView },
    { to: '/AdminCustomization', name: 'Customization', comp: AdminCustomizationView },
    { to: '/AdminCustomWelcome', name: 'Custom Welcome', comp: AdminCustomWelcomeView },
    { to: '/AdminStoryDefaults', name: 'Story Defaults', comp: AdminStoryDefaultsView },
    { to: '/AdminSecurityGeneral', name: 'Security General', comp: AdminSecurityGeneralView },
    { to: '/AdminStoryArchiving', name: 'Story Archiving', comp: AdminStoryArchivingView },
    { to: '/AdminPasswordRules', name: 'Security Password Rules', comp: AdminPasswordRulesView },
    { to: '/AdminDevices', name: 'Security Devices', comp: AdminDevicesView },
    { to: '/AdminCoverArt', name: 'Cover Art', comp: AdminCoverArtView },
    { to: '/AdminTags', name: 'Tags', comp: AdminTagsView },
    { to: '/AdminSecurityAuthentication', name: 'Security Authentication', comp: AdminSecurityAuthenticationView },
    { to: '/AdminFileUploads', name: 'Files - File Uploads', comp: AdminFileUploadsView },
    { to: '/AdminCloudServices', name: 'Files - Cloud Services', comp: AdminCloudServicesView },
    { to: '/AdminSyncEngine', name: 'Files - Sync Engine', comp: AdminSyncEngineView },
    { to: '/AdminUserMetadata', name: 'Custom User Metadata', comp: AdminUserMetadataView },
    { to: '/AdminGeneralGenera', name: 'General General', comp: AdminGeneralGeneralView },
    { to: '/AdminHomeScreens', name: 'Home Screens', comp: AdminHomeScreensView },
    { to: '/AdminCustomApps', name: 'Custom Apps', comp: AdminCustomAppsView },
    { to: '/AdminNamingConvention', name: 'Custom Naming Convention', comp: AdminNamingConventionView }
  ]
}, {
  id: 'bulkUserUploader',
  title: 'Bulk User Uploader',
  routes: [
    { to: '/BulkListItem', name: 'List Item', comp: BulkListItemView }
  ]
},
{
  id: 'hubShareConsoleComponents',
  title: 'HubShare Console',
  routes: [
    { to: '/HubShareConsole', name: 'HubShareConsole', comp: HubShareConsoleView }
  ]
},
{
  id: 'helperComponents',
  title: 'Helper Components',
  routes: [
    { to: '/GeneratePdfThumbnails', name: 'Generate PDF Thumbnails', comp: GeneratePdfThumbnailsView }
  ]
}];
