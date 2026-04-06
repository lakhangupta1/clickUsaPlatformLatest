import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, limit: number = 30): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }

}

@Pipe({
  name: 'shorten2',
  standalone: true
})
export class Shorten2Pipe implements PipeTransform {

  transform(value: any, limit: any = 20): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Pipe({
  name: 'shorten3',
  standalone: true
})
export class Shorten3Pipe implements PipeTransform {

  transform(value: any, limit: any = 4): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Pipe({
  name: 'shorten4',
  standalone: true
})
export class Shorten4Pipe implements PipeTransform {

  transform(value: any, limit: any = 50): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Pipe({
  name: 'shorten5',
  standalone: true
})
export class Shorten5Pipe implements PipeTransform {

  transform(value: any, limit: any = 13): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}