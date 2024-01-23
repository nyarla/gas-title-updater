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
  Message: "メッセージ",
};

/* payload */
type Payload = Record<HeaderId, string>;

/* fetchurl */
const Expiration = 60 * 60 * 24 * 7; // 1 week
