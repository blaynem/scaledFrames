'use client';
import {
  FramerClientSDK,
  createSupabaseClient,
} from '@framer/FramerServerSDK/client';
import { Project } from '@prisma/client';
import { CSSProperties, useState } from 'react';

const createImagePath = ({
  teamId,
  projectId,
  fileName,
}: {
  teamId: string;
  projectId: string;
  fileName: string;
}) => {
  return `${teamId}/${projectId}/${fileName}`;
};

const clientSDK = FramerClientSDK();

const buttonStyle: CSSProperties = {
  padding: '10px',
  margin: '10px',
  border: '1px solid black',
  borderRadius: '5px',
};
const inputStyle: CSSProperties = {
  padding: '10px',
  margin: '10px',
  border: '1px solid black',
  borderRadius: '5px',
};
const divWrapper: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};
export const APITester = () => {
  const supabase = createSupabaseClient();
  const [displayUser, setDisplayUser] = useState<any | null>(null);
  const [otpRequested, setOtpRequested] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const uploadImage = async () => {
    const user = await clientSDK.user.get();
    const _teams = await clientSDK.teams.getAll();
    if ('error' in user || 'error' in _teams) {
      return console.error('---error', {user, _teams});
    }

    if (!image) {
      console.log('---no image');
      return;
    }

    const team = _teams[0];

    const response = await clientSDK.frames.image.saveToFrame({
      teamId: team.id,
      projectId: team.projects[0].id,
      frameId: team.projects[0].rootFrame?.id || '',
      file: image,
      previousFrameImageUrl: team.projects[0].rootFrame?.imageUrl,
    });
    if ('error' in response) {
      console.error('---error', response);
      return;
    }
    console.log('---response', response);
  };

  const deleteImage = async () => {
    const user = await clientSDK.user.get();
    const _teams = await clientSDK.teams.getAll();
    if ('error' in user || 'error' in _teams) {
      return console.error('---error', {user, _teams});
    }

    if (!image) {
      return;
    }

    const team = _teams[0];
    const { data, error } = await supabase.storage.from('frames').remove([
      createImagePath({
        teamId: team.id,
        projectId: team.projects[0].id,
        fileName: image.name,
      }),
    ]);
    if (error) {
      console.error('---error', error);
    }
    console.log('---data', data);
  };

  const requestOTP = async () => {
    setOtpRequested(null);
    const response = await supabase.auth.signInWithOtp({
      // const response = await clientSDK.auth.requestOTP({
      email: 'blayne.marjama@gmail.com',
    });
    console.log('---otp request', response);
    if ('erorr' in response) {
      return setOtpRequested('Failed');
    }
    setOtpRequested('Sent OTP');
  };

  const verifyOTP = async () => {
    const otp = (document.getElementById('otp') as HTMLInputElement).value;
    setOtpVerified(null);
    const response = await supabase.auth.verifyOtp({
      // const response = await clientSDK.auth.verifyOTP({
      email: 'blayne.marjama@gmail.com',
      token: otp,
      type: 'magiclink',
    });
    console.log('---otp response', response);
    if (response.error) {
      return setOtpVerified(`Failed: ${response.error}`);
    }
    setOtpVerified('Verified');
  };

  const fetchProjects = async () => {
    const response = await clientSDK.projects.get();
    if ('error' in response) {
      return setProjects(null);
    }
    setProjects(response);
  };

  const getUser = async () => {
    const userdata = await clientSDK.user.get();
    console.log('---userdata', userdata);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return setDisplayUser('No user found');
    }
    setDisplayUser({
      id: data.user.id,
      email: data.user.email,
    });
  };

  return (
    <div
      style={{
        width: 600,
        marginTop: 16,
        border: '1px solid black',
      }}
    >
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>
        Testing the SDK
      </h2>
      <div style={divWrapper}>
        <button style={buttonStyle} onClick={getUser}>
          Get user
        </button>
        {displayUser && <p>{JSON.stringify(displayUser)}</p>}
      </div>
      <div style={divWrapper}>
        <button style={buttonStyle} onClick={requestOTP}>
          Request OTP
        </button>
        {otpRequested && <p>{otpRequested}</p>}
      </div>
      <div style={divWrapper}>
        <input id="otp" placeholder="Enter OTP" style={inputStyle} />
        <button style={buttonStyle} onClick={verifyOTP}>
          Verify OTP
        </button>
        {otpVerified && <p>{otpVerified}</p>}
      </div>
      <div>
        <button style={buttonStyle} onClick={fetchProjects}>
          fetch projects
        </button>
        <div>{JSON.stringify(projects)}</div>
      </div>
      <div>
        <button style={buttonStyle} onClick={uploadImage}>
          test upload iamge
        </button>
      </div>
      <div>
        <button style={buttonStyle} onClick={deleteImage}>
          Delete uploaded iamge
        </button>
      </div>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
    </div>
  );
};
