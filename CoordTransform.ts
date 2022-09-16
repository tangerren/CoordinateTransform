/**
 * GCJ02、Bd09、WGS84之间互转
 * GCJ02（火星坐标系）：高德、腾讯、谷歌中国
 * Bd09（百度坐标系）：百度
 * WGS84：天地图、谷歌地球
 */
class CoordTransform {
  constructor() {}

  // 定义一些常量
  static readonly x_PI = (3.14159265358979324 * 3000.0) / 180.0;
  static readonly PI = 3.1415926535897932384626;
  static readonly a = 6378245.0;
  static readonly ee = 0.00669342162296594323;

  /** BD09 转 GCJ02 */
  static Bd09ToGcj02 = function (bd_lon: number, bd_lat: number) {
    let x = bd_lon - 0.0065;
    let y = bd_lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_PI);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_PI);
    let gg_lng = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  };

  /** GCJ02 转 BD09 */
  static Gcj02ToBd09 = function (lng: number, lat: number) {
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  };

  /** WGS84 转 GCJ02 */
  static Ggs84ToGcj02 = function (lng: number, lat: number) {
    if (this.isOutOfChina(lng, lat)) {
      return [lng, lat];
    } else {
      let dLat = this.transformLat(lng - 105.0, lat - 35.0);
      let dLng = this.transformLng(lng - 105.0, lat - 35.0);
      let radLat = (lat / 180.0) * this.PI;
      let magic = Math.sin(radLat);
      magic = 1 - this.ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.PI);
      dLng = (dLng * 180.0) / ((this.a / sqrtMagic) * Math.cos(radLat) * this.PI);
      let mgLat = lat + dLat;
      let mgLng = lng + dLng;
      return [mgLng, mgLat];
    }
  };

  /** GCJ02 转 WGS84 */
  static Gcj02ToWgs84 = function (lng: number, lat: number) {
    if (this.isOutOfChina(lng, lat)) {
      return [lng, lat];
    } else {
      let dLat = this.transformLat(lng - 105.0, lat - 35.0);
      let dLng = this.transformLng(lng - 105.0, lat - 35.0);
      let radLat = (lat / 180.0) * this.PI;
      let magic = Math.sin(radLat);
      magic = 1 - this.ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.PI);
      dLng = (dLng * 180.0) / ((this.a / sqrtMagic) * Math.cos(radLat) * this.PI);
      let mgLat = lat + dLat;
      let mgLng = lng + dLng;
      return [lng * 2 - mgLng, lat * 2 - mgLat];
    }
  };

  /** BD09 转 WGS84 */
  static Bd09ToWGS84 = function (bd_lon: number, bd_lat: number) {
    let gjc02 = this.Bd09ToGcj02(bd_lon, bd_lat);
    return this.Gcj02ToWgs84(gjc02[0], gjc02[1]);
  };
  
  static transformLat = function (lng: number, lat: number) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin((lat / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * this.PI) + 320 * Math.sin((lat * this.PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  };

  static transformLng = function (lng: number, lat: number) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin((lng / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * this.PI) + 300.0 * Math.sin((lng / 30.0) * this.PI)) * 2.0) / 3.0;
    return ret;
  };

  /**判断是否在国内，不在国内则不做偏移*/
  static isOutOfChina = function (lng: number, lat: number) {
    // 纬度3.86~53.55,经度73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };
}

export { CoordTransform };
