interface AudioTrack {
  enabled: boolean;
  id: string;
  kind: string;
  label: string;
  language: string;
  sourceBuffer: any;
}

interface AudioTrackList {
  [index: number]: AudioTrack;
  length: number;
  getTrackById(id: string): AudioTrack | null;
}

interface HTMLVideoElement extends HTMLMediaElement {
  audioTracks?: AudioTrackList;
}