declare module 'wilayah-indonesia' {
  const wilayah: (query: string, type: 'provinsi' | 'kota' | 'kecamatan' | 'kelurahan', inRegion?: any) => Promise<any[]>;
  export default wilayah;
}
