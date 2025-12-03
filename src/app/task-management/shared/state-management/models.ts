export interface TasksStoreDefaultState {
  _fetchListing: boolean;
  _fetchById: boolean;
  _requestedId: string | null;
  currentPage: number;
  pageSize: number;
}
