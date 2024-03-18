import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  AsyncPipe,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { CreateClientModel } from '../../model/CreateClientModel';
import { BehaviorSubject } from 'rxjs';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    AgGridAngular,
    RouterLink,
    RouterLinkActive,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    AsyncPipe,
    LottieComponent,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css',
})
export class AddClientComponent implements OnInit {
  clientFormInformation: FormGroup;
  isAllValid: boolean = false;
  clientIndustries: [] = [];
  currentClient: Record<string, any> | Record<string, any[]> = {};
  currentClientId: string = '';
  clientType: string = 'INDIVISUAL';
  logo: string = '';
  tanNumber: string = 'tan';
  vatNumber: string = 'vat';
  edit: boolean = false;
  countries: {
    countryId: string;
    name: string;
    code: number;
    currency: string;
    currencyCode: string;
  }[] = [];
  showRespectiveStates: { stateId: string; name: string; code: number }[] = [];
  showRespectiveCities: { cityId: string; name: string }[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
  show = new BehaviorSubject(false);
  countriesFetched = new BehaviorSubject(false);

  options: AnimationOptions = {
    path: 'assets/loading-fb.json',
  };

  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    fb: FormBuilder,
    private route: Router
  ) {
    this.clientFormInformation = fb.group({
      businessName: ['', Validators.required],
      clientIndustry: ['', Validators.required],
      gstNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
          ),
        ],
      ],
      panNumber: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')],
      ],
      alias: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      streetAddress: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.apiService.getClientIndustry().subscribe({
      next: (value) => {
        value.data.forEach((industry) => {
          this.clientIndustries.push(industry['industryName']);
        });
      },
    });
    this.apiService.getCountries().subscribe({
      next: (value) => {
        value.data.forEach((data) => {
          this.countries.push({
            countryId: data['countryId'],
            name: data['name'],
            code: data['code'],
            currency: data['currency'],
            currencyCode: data['currencyCode'],
          });
        });
        this.countriesFetched.next(true);
      },
      error: (err) => {},
    });
    this.router.params.subscribe((params) => {
      this.currentClientId = params['id'];
      if (this.currentClientId) {
        this.apiService.getClient(this.currentClientId).subscribe({
          next: (val) => {
            this.currentClient = val.data;
            this.f.controls['businessName'].setValue(val.data.name);
            setTimeout(() => {
              this.f.controls['clientIndustry'].setValue(val.data.industryName);
            }, 500);
            this.f.controls['gstNumber'].setValue(val.data.gst);
            this.f.controls['panNumber'].setValue(val.data.pan);
            this.f.controls['alias'].setValue(val.data.nickName);
            this.f.controls['email'].setValue(val.data.email);
            this.f.controls['phone'].setValue(val.data.phone);
            this.edit = true;
          },
        });
        this.apiService.getAddress(this.currentClientId).subscribe({
          next: (value) => {
            if (value.code === 200) {
              this.currentClient = { ...this.currentClient, ...value.data };
              this.f.controls['postalCode'].setValue(value.data['pincode']);
              this.f.controls['streetAddress'].setValue(
                value.data['addressLineOne']
              );
              let currentCountryCode: number;
              this.countriesFetched.subscribe({
                next: (fetched) => {
                  if (fetched) {
                    for (let i = 0; i < this.countries.length; i++) {
                      if (this.countries[i].name == value.data['countryName']) {
                        currentCountryCode = Number(this.countries[i].code);
                        this.f.controls['country'].setValue(currentCountryCode);
                        this.onSelectCountry(currentCountryCode);
                        break;
                      }
                    }
                    setTimeout(() => {
                      let currentStateCode: number;
                      for (
                        let i = 0;
                        i < this.showRespectiveStates.length;
                        i++
                      ) {
                        if (
                          this.showRespectiveStates[i].name ==
                          value.data['stateName']
                        ) {
                          currentStateCode = Number(
                            this.showRespectiveStates[i].code
                          );
                          this.f.controls['state'].setValue(currentStateCode);
                          this.onSelectState(currentStateCode);
                          setTimeout(() => {
                            this.f.controls['city'].setValue(
                              value.data['cityName']
                            );
                          }, 500);
                          break;
                        }
                      }
                    }, 500);
                  }
                },
              });
            }
            this.show.next(true);
          },
        });
        this.show.next(true);
      }
    });
  }

  onSelectCountry(selectedCountryCode: any | number) {
    this.f.controls['state'].setValue('');
    const countryCode =
      typeof selectedCountryCode === 'number'
        ? selectedCountryCode
        : selectedCountryCode.target.value;
    this.showRespectiveStates = [];
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].code === Number(countryCode)) {
        this.selectedCountry = this.countries[i].name;
        break;
      }
    }
    this.apiService.getStates(Number(countryCode)).subscribe({
      next: (value) => {
        value.data.forEach((data) => {
          this.showRespectiveStates.push({
            stateId: data['stateId'],
            name: data['name'],
            code: data['code'],
          });
        });
      },
    });
    this.showRespectiveCities = [];
  }

  onSelectState(selectedStateCode: any | number) {
    this.f.controls['city'].setValue('');
    const stateCode =
      typeof selectedStateCode === 'number'
        ? selectedStateCode
        : selectedStateCode.target.value;
    this.showRespectiveCities = [];
    for (let i = 0; i < this.showRespectiveStates.length; i++) {
      if (this.showRespectiveStates[i].code === Number(stateCode)) {
        this.selectedState = this.showRespectiveStates[i].name;
        break;
      }
    }
    this.apiService.getCities(Number(stateCode)).subscribe({
      next: (value) => {
        value.data.forEach((data) => {
          this.showRespectiveCities.push({
            cityId: data['cityId'],
            name: data['name'],
          });
        });
      },
    });
  }

  tabs: { name: string; id: number; open: boolean }[] = [
    {
      name: 'Business Information',
      id: 1,
      open: true,
    },
    {
      name: 'Tax Information',
      id: 2,
      open: true,
    },
    {
      name: 'Address',
      id: 3,
      open: true,
    },
    {
      name: 'Shipping Details',
      id: 4,
      open: true,
    },
    {
      name: 'Additional Details',
      id: 5,
      open: true,
    },
  ];

  onSelectDropdown(id: number) {
    // this.selectedDropdown === id;
    this.tabs[id - 1].open = !this.tabs[id - 1].open;
  }

  get f() {
    return this.clientFormInformation;
  }

  validateForm() {
    if (
      this.f.controls['businessName'].errors?.['required'] ||
      this.f.controls['clientIndustry'].errors?.['required'] ||
      this.f.controls['gstNumber'].errors?.['required'] ||
      this.f.controls['panNumber'].errors?.['required'] ||
      this.f.controls['email'].errors?.['required'] ||
      this.f.controls['phone'].errors?.['required'] ||
      this.f.controls['gstNumber'].errors?.['pattern'] ||
      this.f.controls['panNumber'].errors?.['pattern'] ||
      this.f.controls['email'].errors?.['email'] ||
      this.f.controls['country'].errors?.['required'] ||
      this.f.controls['state'].errors?.['required'] ||
      this.f.controls['city'].errors?.['required'] ||
      this.f.controls['postalCode'].errors?.['required'] ||
      this.f.controls['streetAddress'].errors?.['required']
    ) {
      this.isAllValid = true;
      return true;
    }
    return false;
  }

  updateClient() {
    if (this.validateForm()) {
      return;
    }

    const payloadClient: object = {
      name: this.f.controls['businessName'].value,
      industryName: this.f.controls['clientIndustry'].value,
      gst: this.f.controls['gstNumber'].value,
      pan: this.f.controls['panNumber'].value,
      nickName: this.f.controls['alias'].value,
      phone: this.f.controls['phone'].value,
    };

    this.apiService
      .updateClient(this.currentClient['clientId'], payloadClient)
      .subscribe({
        next: (value) => {},
      });

    let countryName: string = '';
    for (let i = 0; i < this.countries.length; i++) {
      if (Number(this.f.controls['country'].value) === this.countries[i].code) {
        countryName = this.countries[i].name;
        break;
      }
    }

    let stateName: string = '';
    for (let i = 0; i < this.showRespectiveStates.length; i++) {
      if (
        Number(this.f.controls['state'].value) ===
        this.showRespectiveStates[i].code
      ) {
        stateName = this.showRespectiveStates[i].name;
        break;
      }
    }

    const payloadAddress: object = {
      addressLineOne: this.f.controls['streetAddress'].value,
      pincode: this.f.controls['postalCode'].value,
      cityName: this.f.controls['city'].value,
      countryName: countryName,
      stateName: stateName,
    };

    this.apiService
      .updateAddress(this.currentClient['addressId'], payloadAddress)
      .subscribe({
        next: (value) => {},
      });
  }

  onCreateClient() {
    if (this.validateForm()) {
      return;
    }

    const payload: CreateClientModel = {
      name: this.f.value['businessName'],
      industryName: this.f.value['clientIndustry'],
      clientType: this.clientType,
      logo: this.logo,
      gst: this.f.value['gstNumber'],
      email: this.f.value['email'],
      pan: this.f.value['panNumber'],
      tan: this.tanNumber,
      vat: this.vatNumber,
      nickName: this.f.value['alias'],
      phone: this.f.value['phone'],
    };
    this.apiService.createClient(payload).subscribe({
      next: (value) => {
        const payloadAddress = {
          addressLineOne: this.f.value['streetAddress'],
          cityName: this.f.value['city'],
          stateName: this.selectedState,
          countryName: this.selectedCountry,
          pincode: this.f.value['postalCode'],
        };
        this.apiService.createAddress(payloadAddress).subscribe({
          next: (addressValue) => {
            this.apiService
              .connectClientAddress(
                value.data.clientId,
                addressValue.data['addressId']
              )
              .subscribe({
                next: (connectCA) => {},
              });
          },
        });
        this.route.navigate([`/client`]);
      },
      error: (err) => {},
    });
  }
}
