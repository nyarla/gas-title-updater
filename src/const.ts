/* internal */
const _headerIdToColumnIndex: Record<HeaderId, number> = {};
const _headerKeyToHeaderId: Record<HeaderKey, HeaderId> = {};

/* headers */
type HeaderId = string;
type HeaderKey = string;

const Headers: Record<HeaderId, HeaderKey> = {
  DateTime: "更新日",
  StatusCode: "HTTP",
  Locked: "ロック",
  Link: "記事内リンク",
  Permalink: "固有リンク",
  Title: "タイトル",
};

/* payload */
type Payload = Record<HeaderId, string>;
