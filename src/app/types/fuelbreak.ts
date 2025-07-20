import type { Geometry } from "geojson";
import type { StacFeature } from "../../client";

export class FuelBreak {
  id!: string;
  bbox!: [number, number, number, number];
  type: "Feature" = "Feature";
  links!: Array<{ rel: string; type: string; href: string }>;
  assets!: Record<string, { href: string; type: string; roles: string[] }>;
  geometry!: Geometry;
  collection!: string;
  properties!: {
    title: string;
    datetime: string;
    location: string;
    end_datetime: string;
    official_fuel_break: boolean;
  };
  stac_version!: string;
  stac_extensions!: string[];

  constructor(data: {
    id: string;
    bbox: [number, number, number, number];
    links: Array<{ rel: string; type: string; href: string }>;
    assets: Record<string, { href: string; type: string; roles: string[] }>;
    geometry: Geometry;
    collection: string;
    properties: {
      title: string;
      datetime: string;
      location: string;
      end_datetime: string;
      official_fuel_break: boolean;
    };
    stac_version: string;
    stac_extensions: string[];
  }) {
    Object.assign(this, data);
  }

  static fromFeature(feature: StacFeature): FuelBreak {
    const props = feature.properties;
    return new FuelBreak({
      id: feature.id,
      bbox: Array.isArray(props.bbox) && props.bbox.length === 4
        ? (props.bbox as [number, number, number, number])
        : [0, 0, 0, 0], // Or throw error

      links: Array.isArray(props.links) ? (props.links as FuelBreak["links"]) : [],
      assets: typeof props.assets === "object" && props.assets !== null
        ? (props.assets as FuelBreak["assets"])
        : {},

      geometry: feature.geometry ?? { type: "GeometryCollection", geometries: [] },

      collection: typeof props.collection === "string" ? props.collection : "",

      properties: {
        title: typeof props.title === "string" ? props.title : "",
        datetime: typeof props.datetime === "string" ? props.datetime : "",
        location: typeof props.location === "string" ? props.location : "",
        end_datetime: typeof props.end_datetime === "string" ? props.end_datetime : "",
        official_fuel_break: Boolean(props.official_fuel_break),
      },

      stac_version: typeof props.stac_version === "string" ? props.stac_version : "",
      stac_extensions: Array.isArray(props.stac_extensions) ? (props.stac_extensions as string[]) : [],
    });
  }

  toJson(): StacFeature {
    return {
      id: this.id,
      type: "Feature",
      geometry: this.geometry,
      properties: {
        ...this.properties,
        bbox: this.bbox,
        links: this.links,
        assets: this.assets,
        collection: this.collection,
        stac_version: this.stac_version,
        stac_extensions: this.stac_extensions,
      },
    };
  }
}
